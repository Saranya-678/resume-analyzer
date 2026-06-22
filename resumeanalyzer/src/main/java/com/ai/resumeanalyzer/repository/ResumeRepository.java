package com.ai.resumeanalyzer.repository;

import com.ai.resumeanalyzer.entity.ResumeData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository
        extends JpaRepository<ResumeData, Long> {

    List<ResumeData> findAllByOrderByAtsScoreDesc();

    List<ResumeData> findBySkillsContaining(String skill);

    ResumeData findByEmail(String email);

    List<ResumeData> findByAtsScoreGreaterThanEqual(int score);
}