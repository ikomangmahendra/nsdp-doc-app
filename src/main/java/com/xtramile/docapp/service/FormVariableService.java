package com.xtramile.docapp.service;

import com.xtramile.docapp.domain.FormVariable;
import com.xtramile.docapp.repository.FormVariableRepository;
import com.xtramile.docapp.service.dto.FormVariableDTO;
import com.xtramile.docapp.service.mapper.FormVariableMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.xtramile.docapp.domain.FormVariable}.
 */
@Service
public class FormVariableService {

    private static final Logger LOG = LoggerFactory.getLogger(FormVariableService.class);

    private final FormVariableRepository formVariableRepository;

    private final FormVariableMapper formVariableMapper;

    public FormVariableService(FormVariableRepository formVariableRepository, FormVariableMapper formVariableMapper) {
        this.formVariableRepository = formVariableRepository;
        this.formVariableMapper = formVariableMapper;
    }

    /**
     * Save a formVariable.
     *
     * @param formVariableDTO the entity to save.
     * @return the persisted entity.
     */
    public FormVariableDTO save(FormVariableDTO formVariableDTO) {
        LOG.debug("Request to save FormVariable : {}", formVariableDTO);
        FormVariable formVariable = formVariableMapper.toEntity(formVariableDTO);
        formVariable = formVariableRepository.save(formVariable);
        return formVariableMapper.toDto(formVariable);
    }

    /**
     * Update a formVariable.
     *
     * @param formVariableDTO the entity to save.
     * @return the persisted entity.
     */
    public FormVariableDTO update(FormVariableDTO formVariableDTO) {
        LOG.debug("Request to update FormVariable : {}", formVariableDTO);
        FormVariable formVariable = formVariableMapper.toEntity(formVariableDTO);
        formVariable = formVariableRepository.save(formVariable);
        return formVariableMapper.toDto(formVariable);
    }

    /**
     * Partially update a formVariable.
     *
     * @param formVariableDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<FormVariableDTO> partialUpdate(FormVariableDTO formVariableDTO) {
        LOG.debug("Request to partially update FormVariable : {}", formVariableDTO);

        return formVariableRepository
            .findById(formVariableDTO.getId())
            .map(existingFormVariable -> {
                formVariableMapper.partialUpdate(existingFormVariable, formVariableDTO);

                return existingFormVariable;
            })
            .map(formVariableRepository::save)
            .map(formVariableMapper::toDto);
    }

    /**
     * Get all the formVariables.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<FormVariableDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all FormVariables");
        return formVariableRepository.findAll(pageable).map(formVariableMapper::toDto);
    }

    /**
     * Get one formVariable by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<FormVariableDTO> findOne(String id) {
        LOG.debug("Request to get FormVariable : {}", id);
        return formVariableRepository.findById(id).map(formVariableMapper::toDto);
    }

    /**
     * Delete the formVariable by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        LOG.debug("Request to delete FormVariable : {}", id);
        formVariableRepository.deleteById(id);
    }
}
