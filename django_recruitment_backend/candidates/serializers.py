from rest_framework import serializers
from .models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Candidate
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'applied_date')
