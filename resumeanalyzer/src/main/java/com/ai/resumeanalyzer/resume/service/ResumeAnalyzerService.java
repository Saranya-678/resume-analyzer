package com.ai.resumeanalyzer.resume.service;

import com.ai.resumeanalyzer.entity.ResumeData;
import com.ai.resumeanalyzer.repository.ResumeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeAnalyzerService {

    @Autowired
    private ResumeRepository resumeRepository;

    public Map<String, Object> analyzeResume(String text) {

        List<String> skills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        List<String> certifications = new ArrayList<>();

        String lowerText = text.toLowerCase();

        String email = "Not Found";
        String phone = "Not Found";
        String linkedin = "Not Found";

        Pattern emailPattern = Pattern.compile("[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+");
        Matcher emailMatcher = emailPattern.matcher(text);
        if (emailMatcher.find()) {
            email = emailMatcher.group();
        }

        Pattern phonePattern = Pattern.compile("\\b\\d{10}\\b");
        Matcher phoneMatcher = phonePattern.matcher(text);
        if (phoneMatcher.find()) {
            phone = phoneMatcher.group();
        }

        Pattern linkedinPattern = Pattern.compile("linkedin\\.com/in/[A-Za-z0-9_-]+");
        Matcher linkedinMatcher = linkedinPattern.matcher(lowerText);
        if (linkedinMatcher.find()) {
            linkedin = linkedinMatcher.group();
        }

        int skillScore = 0;
        int certScore = 0;

        if (lowerText.contains("java")) {
            skills.add("Java");
            skillScore += 20;
        } else {
            missingSkills.add("Java");
            suggestions.add("Learn Java");
        }

        if (lowerText.contains("spring")) {
            skills.add("Spring Boot");
            skillScore += 20;
        } else {
            missingSkills.add("Spring Boot");
            suggestions.add("Build Spring Boot projects");
        }

        if (lowerText.contains("mysql")) {
            skills.add("MySQL");
            skillScore += 20;
        } else {
            missingSkills.add("MySQL");
            suggestions.add("Practice MySQL queries");
        }

        if (lowerText.contains("react")) {
            skills.add("React");
            skillScore += 20;
        } else {
            missingSkills.add("React");
            suggestions.add("Add React frontend projects");
        }

        if (lowerText.contains("python")) {
            skills.add("Python");
            skillScore += 20;
        } else {
            missingSkills.add("Python");
            suggestions.add("Learn Python basics");
        }

        if (lowerText.contains("aws")) {
            certifications.add("AWS");
            certScore += 10;
        }

        if (lowerText.contains("azure")) {
            certifications.add("Azure");
            certScore += 10;
        }

        if (lowerText.contains("google cloud")) {
            certifications.add("Google Cloud");
            certScore += 10;
        }

        // FIX: Score 100-ஐ மீறாமல் cap பண்று
        int atsScore = Math.min(skillScore + certScore, 100);
        int matchPercentage = Math.min(skillScore, 100);

        Map<String, Object> result = new HashMap<>();
        result.put("skills", skills);
        result.put("missingSkills", missingSkills);
        result.put("suggestions", suggestions);
        result.put("certifications", certifications);
        result.put("atsScore", atsScore);
        result.put("matchPercentage", matchPercentage);
        result.put("email", email);
        result.put("phone", phone);
        result.put("linkedin", linkedin);

        // FIX: Same email again upload பண்ணா duplicate insert ஆகாமல் update ஆகும்
        ResumeData data = resumeRepository.findByEmail(email);
        if (data == null) {
            data = new ResumeData();
        }
        data.setEmail(email);
        data.setPhone(phone);
        data.setSkills(skills.toString());
        data.setAtsScore(atsScore);
        data.setMatchPercentage(matchPercentage);
        resumeRepository.save(data);

        return result;
    }
}
