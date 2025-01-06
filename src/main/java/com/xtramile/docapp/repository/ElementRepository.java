package com.xtramile.docapp.repository;

import com.xtramile.docapp.domain.Element;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Element entity.
 */
@Repository
public interface ElementRepository extends MongoRepository<Element, String> {}
