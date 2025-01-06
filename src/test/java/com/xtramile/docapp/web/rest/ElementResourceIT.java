package com.xtramile.docapp.web.rest;

import static com.xtramile.docapp.domain.ElementAsserts.*;
import static com.xtramile.docapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xtramile.docapp.IntegrationTest;
import com.xtramile.docapp.domain.Element;
import com.xtramile.docapp.repository.ElementRepository;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link ElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ElementResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ElementRepository elementRepository;

    @Autowired
    private MockMvc restElementMockMvc;

    private Element element;

    private Element insertedElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Element createEntity() {
        return new Element().type(DEFAULT_TYPE).name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Element createUpdatedEntity() {
        return new Element().type(UPDATED_TYPE).name(UPDATED_NAME);
    }

    @BeforeEach
    public void initTest() {
        element = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedElement != null) {
            elementRepository.delete(insertedElement);
            insertedElement = null;
        }
    }

    @Test
    void createElement() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Element
        var returnedElement = om.readValue(
            restElementMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(element)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Element.class
        );

        // Validate the Element in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertElementUpdatableFieldsEquals(returnedElement, getPersistedElement(returnedElement));

        insertedElement = returnedElement;
    }

    @Test
    void createElementWithExistingId() throws Exception {
        // Create the Element with an existing ID
        element.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(element)))
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkTypeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        element.setType(null);

        // Create the Element, which fails.

        restElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(element)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        element.setName(null);

        // Create the Element, which fails.

        restElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(element)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllElements() throws Exception {
        // Initialize the database
        insertedElement = elementRepository.save(element);

        // Get all the elementList
        restElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(element.getId())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    void getElement() throws Exception {
        // Initialize the database
        insertedElement = elementRepository.save(element);

        // Get the element
        restElementMockMvc
            .perform(get(ENTITY_API_URL_ID, element.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(element.getId()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    void getNonExistingElement() throws Exception {
        // Get the element
        restElementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingElement() throws Exception {
        // Initialize the database
        insertedElement = elementRepository.save(element);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the element
        Element updatedElement = elementRepository.findById(element.getId()).orElseThrow();
        updatedElement.type(UPDATED_TYPE).name(UPDATED_NAME);

        restElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedElement))
            )
            .andExpect(status().isOk());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedElementToMatchAllProperties(updatedElement);
    }

    @Test
    void putNonExistingElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        element.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(put(ENTITY_API_URL_ID, element.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(element)))
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        element.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(element))
            )
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        element.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(element)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateElementWithPatch() throws Exception {
        // Initialize the database
        insertedElement = elementRepository.save(element);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the element using partial update
        Element partialUpdatedElement = new Element();
        partialUpdatedElement.setId(element.getId());

        partialUpdatedElement.type(UPDATED_TYPE).name(UPDATED_NAME);

        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedElement))
            )
            .andExpect(status().isOk());

        // Validate the Element in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertElementUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedElement, element), getPersistedElement(element));
    }

    @Test
    void fullUpdateElementWithPatch() throws Exception {
        // Initialize the database
        insertedElement = elementRepository.save(element);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the element using partial update
        Element partialUpdatedElement = new Element();
        partialUpdatedElement.setId(element.getId());

        partialUpdatedElement.type(UPDATED_TYPE).name(UPDATED_NAME);

        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedElement))
            )
            .andExpect(status().isOk());

        // Validate the Element in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertElementUpdatableFieldsEquals(partialUpdatedElement, getPersistedElement(partialUpdatedElement));
    }

    @Test
    void patchNonExistingElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        element.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, element.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(element))
            )
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        element.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(element))
            )
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamElement() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        element.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(element)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Element in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteElement() throws Exception {
        // Initialize the database
        insertedElement = elementRepository.save(element);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the element
        restElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, element.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return elementRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Element getPersistedElement(Element element) {
        return elementRepository.findById(element.getId()).orElseThrow();
    }

    protected void assertPersistedElementToMatchAllProperties(Element expectedElement) {
        assertElementAllPropertiesEquals(expectedElement, getPersistedElement(expectedElement));
    }

    protected void assertPersistedElementToMatchUpdatableProperties(Element expectedElement) {
        assertElementAllUpdatablePropertiesEquals(expectedElement, getPersistedElement(expectedElement));
    }
}
