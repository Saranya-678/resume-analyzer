package com.ai.resumeanalyzer.resume;

import com.ai.resumeanalyzer.entity.ResumeData;
import com.ai.resumeanalyzer.repository.ResumeRepository;
import com.ai.resumeanalyzer.resume.service.ResumeAnalyzerService;
import com.ai.resumeanalyzer.resume.service.ResumeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

// FIX: "*" கொடுக்கணும் - "localhost:3000" மட்டும் வச்சிருந்தா Postman & Railway-ல் CORS error வரும்
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private ResumeAnalyzerService analyzerService;

    @Autowired
    private ResumeRepository resumeRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        String text = resumeService.extractText(file);
        Map<String, Object> result = analyzerService.analyzeResume(text);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public List<ResumeData> getAllResumes() {
        return resumeRepository.findAll();
    }

    @GetMapping("/top")
    public List<ResumeData> getTopCandidates() {
        return resumeRepository.findAllByOrderByAtsScoreDesc();
    }

    @GetMapping("/skill/{skill}")
    public List<ResumeData> searchBySkill(@PathVariable String skill) {
        return resumeRepository.findBySkillsContaining(skill);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable Long id) {
        if (!resumeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resumeRepository.deleteById(id);
        return ResponseEntity.ok("Resume Deleted Successfully");
    }

    @PutMapping("/update-score/{id}/{score}")
    public ResponseEntity<String> updateScore(@PathVariable Long id, @PathVariable int score) {
        ResumeData data = resumeRepository.findById(id).orElse(null);
        if (data == null) return ResponseEntity.notFound().build();
        data.setAtsScore(score);
        resumeRepository.save(data);
        return ResponseEntity.ok("ATS Score Updated");
    }

    @GetMapping("/count")
    public long getResumeCount() {
        return resumeRepository.count();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> searchByEmail(@PathVariable String email) {
        ResumeData data = resumeRepository.findByEmail(email);
        if (data == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/score/{score}")
    public List<ResumeData> searchByScore(@PathVariable int score) {
        return resumeRepository.findByAtsScoreGreaterThanEqual(score);
    }

    @GetMapping("/analytics")
    public Object getAnalytics() {
        List<ResumeData> resumes = resumeRepository.findAll();
        int total = resumes.size();
        int topScore = 0;
        int sum = 0;
        for (ResumeData data : resumes) {
            sum += data.getAtsScore();
            if (data.getAtsScore() > topScore) topScore = data.getAtsScore();
        }
        int averageScore = total > 0 ? sum / total : 0;
        return Map.of("totalResumes", total, "averageScore", averageScore, "topScore", topScore);
    }
}
