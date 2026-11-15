package com.habitapp.scan;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NfcTagRepository extends JpaRepository<NfcTag, Long> {

    Optional<NfcTag> findByTagId(String tagId);

    Optional<NfcTag> findByHabitId(Long habitId);

    boolean existsByHabitId(Long habitId);
}