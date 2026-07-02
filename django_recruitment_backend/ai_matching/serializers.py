from rest_framework import serializers

class CandidateRankingSerializer(serializers.Serializer):
    candidate_id = serializers.IntegerField()
    name = serializers.CharField()
    ai_score = serializers.FloatField()
    skills_match = serializers.FloatField()
    experience_match = serializers.FloatField()
    education_match = serializers.FloatField()
    research_score = serializers.FloatField()
    matched_skills = serializers.ListField()
    missing_skills = serializers.ListField()
    recommendation = serializers.CharField()
    status = serializers.CharField()
