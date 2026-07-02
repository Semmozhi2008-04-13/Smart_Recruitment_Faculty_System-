from rest_framework import serializers
from .models import Interview, InterviewPanel

class InterviewPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewPanel
        fields = '__all__'

class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = '__all__'
