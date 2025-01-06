package com.xtramile.docapp.repository;

import com.xtramile.docapp.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Page entity.
 */
@Repository
public interface PageRepository extends MongoRepository<Page, String> {}
