{{- define "taskapi.name" -}}
taskapi
{{- end }}

{{- define "taskapi.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "taskapi.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "taskapi.labels" -}}
app.kubernetes.io/name: {{ include "taskapi.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
{{- end }}

{{- define "taskapi.selectorLabels" -}}
app.kubernetes.io/name: {{ include "taskapi.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "taskapi.image" -}}
{{- if .Values.image.digest -}}
{{- printf "%s@%s" .Values.image.repository .Values.image.digest -}}
{{- else if .Values.image.tag -}}
{{- printf "%s:%s" .Values.image.repository .Values.image.tag -}}
{{- else -}}
{{- fail "either image.digest or image.tag must be set" -}}
{{- end -}}
{{- end }}
