package com.xtramile.docapp.web.rest;

import com.xtramile.docapp.domain.Element;
import com.xtramile.docapp.repository.ElementRepository;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.xtramile.docapp.domain.Element}.
 */
@RestController
@RequestMapping("/api/elements")
public class ElementResource {

    private static final Logger LOG = LoggerFactory.getLogger(ElementResource.class);

    private static final String ENTITY_NAME = "nsdpDocAppElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ElementRepository elementRepository;

    public ElementResource(ElementRepository elementRepository) {
        this.elementRepository = elementRepository;
    }

    /**
     * {@code POST  /elements} : Create a new element.
     *
     * @param element the element to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new element, or with status {@code 400 (Bad Request)} if the element has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Element> createElement(@Valid @RequestBody Element element) throws URISyntaxException {
        LOG.debug("REST request to save Element : {}", element);
        if (element.getId() != null) {
            throw new BadRequestAlertException("A new element cannot already have an ID", ENTITY_NAME, "idexists");
        }
        element = elementRepository.save(element);
        return ResponseEntity.created(new URI("/api/elements/" + element.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, element.getId()))
            .body(element);
    }

    /**
     * {@code PUT  /elements/:id} : Updates an existing element.
     *
     * @param id the id of the element to save.
     * @param element the element to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated element,
     * or with status {@code 400 (Bad Request)} if the element is not valid,
     * or with status {@code 500 (Internal Server Error)} if the element couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Element> updateElement(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Element element
    ) throws URISyntaxException {
        LOG.debug("REST request to update Element : {}, {}", id, element);
        if (element.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, element.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!elementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        element = elementRepository.save(element);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, element.getId()))
            .body(element);
    }

    /**
     * {@code PATCH  /elements/:id} : Partial updates given fields of an existing element, field will ignore if it is null
     *
     * @param id the id of the element to save.
     * @param element the element to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated element,
     * or with status {@code 400 (Bad Request)} if the element is not valid,
     * or with status {@code 404 (Not Found)} if the element is not found,
     * or with status {@code 500 (Internal Server Error)} if the element couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Element> partialUpdateElement(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Element element
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Element partially : {}, {}", id, element);
        if (element.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, element.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!elementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Element> result = elementRepository
            .findById(element.getId())
            .map(existingElement -> {
                if (element.getType() != null) {
                    existingElement.setType(element.getType());
                }
                if (element.getName() != null) {
                    existingElement.setName(element.getName());
                }

                return existingElement;
            })
            .map(elementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, element.getId())
        );
    }

    /**
     * {@code GET  /elements} : get all the elements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of elements in body.
     */
    @GetMapping("")
    public List<Element> getAllElements() {
        LOG.debug("REST request to get all Elements");
        return elementRepository.findAll();
    }

    /**
     * {@code GET  /elements/:id} : get the "id" element.
     *
     * @param id the id of the element to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the element, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Element> getElement(@PathVariable("id") String id) {
        LOG.debug("REST request to get Element : {}", id);
        Optional<Element> element = elementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(element);
    }

    /**
     * {@code DELETE  /elements/:id} : delete the "id" element.
     *
     * @param id the id of the element to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElement(@PathVariable("id") String id) {
        LOG.debug("REST request to delete Element : {}", id);
        elementRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
