package com.xtramile.docapp.web.rest;

import com.xtramile.docapp.repository.FormVariableRepository;
import com.xtramile.docapp.service.FormVariableService;
import com.xtramile.docapp.service.dto.FormVariableDTO;
import com.xtramile.docapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.xtramile.docapp.domain.FormVariable}.
 */
@RestController
@RequestMapping("/api/form-variables")
public class FormVariableResource {

    private static final Logger LOG = LoggerFactory.getLogger(FormVariableResource.class);

    private static final String ENTITY_NAME = "nsdpDocAppFormVariable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormVariableService formVariableService;

    private final FormVariableRepository formVariableRepository;

    public FormVariableResource(FormVariableService formVariableService, FormVariableRepository formVariableRepository) {
        this.formVariableService = formVariableService;
        this.formVariableRepository = formVariableRepository;
    }

    /**
     * {@code POST  /form-variables} : Create a new formVariable.
     *
     * @param formVariableDTO the formVariableDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formVariableDTO, or with status {@code 400 (Bad Request)} if the formVariable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<FormVariableDTO> createFormVariable(@Valid @RequestBody FormVariableDTO formVariableDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save FormVariable : {}", formVariableDTO);
        if (formVariableDTO.getId() != null) {
            throw new BadRequestAlertException("A new formVariable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        formVariableDTO = formVariableService.save(formVariableDTO);
        return ResponseEntity.created(new URI("/api/form-variables/" + formVariableDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, formVariableDTO.getId()))
            .body(formVariableDTO);
    }

    /**
     * {@code PUT  /form-variables/:id} : Updates an existing formVariable.
     *
     * @param id the id of the formVariableDTO to save.
     * @param formVariableDTO the formVariableDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formVariableDTO,
     * or with status {@code 400 (Bad Request)} if the formVariableDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formVariableDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<FormVariableDTO> updateFormVariable(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody FormVariableDTO formVariableDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update FormVariable : {}, {}", id, formVariableDTO);
        if (formVariableDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formVariableDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formVariableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        formVariableDTO = formVariableService.update(formVariableDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formVariableDTO.getId()))
            .body(formVariableDTO);
    }

    /**
     * {@code PATCH  /form-variables/:id} : Partial updates given fields of an existing formVariable, field will ignore if it is null
     *
     * @param id the id of the formVariableDTO to save.
     * @param formVariableDTO the formVariableDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formVariableDTO,
     * or with status {@code 400 (Bad Request)} if the formVariableDTO is not valid,
     * or with status {@code 404 (Not Found)} if the formVariableDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the formVariableDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FormVariableDTO> partialUpdateFormVariable(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody FormVariableDTO formVariableDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update FormVariable partially : {}, {}", id, formVariableDTO);
        if (formVariableDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formVariableDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formVariableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormVariableDTO> result = formVariableService.partialUpdate(formVariableDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formVariableDTO.getId())
        );
    }

    /**
     * {@code GET  /form-variables} : get all the formVariables.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formVariables in body.
     */
    @GetMapping("")
    public ResponseEntity<List<FormVariableDTO>> getAllFormVariables(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of FormVariables");
        Page<FormVariableDTO> page = formVariableService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /form-variables/:id} : get the "id" formVariable.
     *
     * @param id the id of the formVariableDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formVariableDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<FormVariableDTO> getFormVariable(@PathVariable("id") String id) {
        LOG.debug("REST request to get FormVariable : {}", id);
        Optional<FormVariableDTO> formVariableDTO = formVariableService.findOne(id);
        return ResponseUtil.wrapOrNotFound(formVariableDTO);
    }

    /**
     * {@code DELETE  /form-variables/:id} : delete the "id" formVariable.
     *
     * @param id the id of the formVariableDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormVariable(@PathVariable("id") String id) {
        LOG.debug("REST request to delete FormVariable : {}", id);
        formVariableService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
