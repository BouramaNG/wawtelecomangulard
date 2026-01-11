import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TemplateService, TemplateCreateRequest } from '../../../services/template.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-template-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './admin-template-create.component.html',
  styleUrl: './admin-template-create.component.css'
})
export class AdminTemplateCreateComponent {
  templateForm: FormGroup;
  loading = false;
  success = '';
  error = '';

  // Valeurs fixes pour Telna (à adapter si besoin)
  readonly DEFAULT_INVENTORY_ID = 50580;
  readonly DEFAULT_TRAFFIC_POLICY_ID = 789;

  constructor(
    private fb: FormBuilder,
    private templateService: TemplateService
  ) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      notes: [''],
      activation_type: ['MANUAL', Validators.required],
      data_usage_allowance: [null, [Validators.required, Validators.min(1)]],
      data_unit: ['GB', Validators.required], // Ajout du choix de l'unité
      voice_usage_allowance: [0, [Validators.min(0)]],
      sms_usage_allowance: [0, [Validators.min(0)]],
      activation_time_allowance: [null, [Validators.required, Validators.min(1)]],
      earliest_activation_date: [null, Validators.required],
      earliest_available_date: [null, Validators.required],
      latest_available_date: [null, Validators.required],
      supported_countries: [[], Validators.required],
      time_allowance_unit: ['CALENDAR_MONTH', Validators.required],
      time_allowance_duration: [1, [Validators.required, Validators.min(1)]],
      // inventory et traffic_policy ne sont plus dans le formulaire
    });
  }

  get f() { return this.templateForm.controls; }

  // Conversion date string (YYYY-MM-DDTHH:mm) en timestamp ms
  toTimestampMs(dateStr: string): number {
    if (!dateStr) return 0;
    return new Date(dateStr).getTime();
  }

  // Conversion data en octets
  toBytes(value: number, unit: string): number {
    let bytes = value;
    if (unit === 'GB') bytes = value * 1024 * 1024 * 1024;
    else if (unit === 'MB') bytes = value * 1024 * 1024;
    console.log(`[FRONT] Conversion data: ${value} ${unit} = ${bytes} octets`);
    return bytes;
  }

  onSubmit() {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.success = '';
    this.error = '';

    const formValue = this.templateForm.value;
    const dataBytes = this.toBytes(formValue.data_usage_allowance, formValue.data_unit);
    const payload: any = {
      name: formValue.name,
      notes: formValue.notes,
      activation_type: formValue.activation_type,
      data_usage_allowance: dataBytes,
      voice_usage_allowance: formValue.voice_usage_allowance,
      sms_usage_allowance: formValue.sms_usage_allowance,
      activation_time_allowance: formValue.activation_time_allowance,
      earliest_activation_date: this.toTimestampMs(formValue.earliest_activation_date),
      earliest_available_date: this.toTimestampMs(formValue.earliest_available_date),
      latest_available_date: this.toTimestampMs(formValue.latest_available_date),
      supported_countries: formValue.supported_countries.split(',').map((c: string) => c.trim()),
      traffic_policy: this.DEFAULT_TRAFFIC_POLICY_ID,
      time_allowance: {
        unit: formValue.time_allowance_unit,
        duration: formValue.time_allowance_duration
      },
      inventory: this.DEFAULT_INVENTORY_ID
    };

    console.log('[FRONT] 📤 Payload envoyé au backend:', payload);
    console.log('[FRONT] 📋 Structure du payload:', {
      keys: Object.keys(payload),
      data_usage_allowance: payload.data_usage_allowance,
      data_unit: payload.data_unit,
      supported_countries: payload.supported_countries,
      time_allowance: payload.time_allowance,
      has_duration: 'duration' in payload,
      has_duration_unit: 'duration_unit' in payload,
    });

    this.templateService.createTemplate(payload).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('[FRONT] ✅ Réponse succès backend:', response);
        if (response.success) {
          this.success = 'Template créé avec succès !';
          this.templateForm.reset();
        } else {
          this.error = response.message || 'Erreur lors de la création du template';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('[FRONT] ❌ Erreur création template:', err);
        console.error('[FRONT] 📊 Détails de l\'erreur:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          error_errors: err.error?.errors,
          error_debug: err.error?.debug,
        });
        if (err.error && err.error.errors) {
          const errorMessages = Object.entries(err.error.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join(' | ');
          this.error = `Erreur de validation: ${errorMessages}`;
        } else if (err.error && err.error.message) {
          this.error = 'Erreur backend : ' + err.error.message;
        } else if (err.status === 400 && err.error) {
          this.error = 'Erreur 400 : ' + JSON.stringify(err.error);
        } else {
          this.error = 'Erreur de connexion au serveur';
        }
      }
    });
  }
}
