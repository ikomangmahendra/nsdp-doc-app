package com.xtramile.docapp.repository;

import com.xtramile.docapp.domain.Section;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Section entity.
 */
@Repository
public interface SectionRepository extends MongoRepository<Section, String> {}
