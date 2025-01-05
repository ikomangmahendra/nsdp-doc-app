package com.xtramile.docapp.repository;

import com.xtramile.docapp.domain.FormVariable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the FormVariable entity.
 */
@Repository
public interface FormVariableRepository extends MongoRepository<FormVariable, String> {}
