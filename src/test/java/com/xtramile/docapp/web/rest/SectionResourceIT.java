package com.xtramile.docapp.web.rest;

import static com.xtramile.docapp.domain.SectionAsserts.*;
import static com.xtramile.docapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xtramile.docapp.IntegrationTest;
import com.xtramile.docapp.domain.Section;
import com.xtramile.docapp.repository.SectionRepository;
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
 * Integration tests for the {@link SectionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SectionResourceIT {

    private static final String DEFAULT_SECTION_CODE = "AAAAAAAAAA";
    private static final String UPDATED_SECTION_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_SECTION_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SECTION_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;

    private static final String ENTITY_API_URL = "/api/sections";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private MockMvc restSectionMockMvc;

    private Section section;

    private Section insertedSection;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Section createEntity() {
        return new Section().sectionCode(DEFAULT_SECTION_CODE).sectionName(DEFAULT_SECTION_NAME).orderIndex(DEFAULT_ORDER_INDEX);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Section createUpdatedEntity() {
        return new Section().sectionCode(UPDATED_SECTION_CODE).sectionName(UPDATED_SECTION_NAME).orderIndex(UPDATED_ORDER_INDEX);
    }

    @BeforeEach
    public void initTest() {
        section = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedSection != null) {
            sectionRepository.delete(insertedSection);
            insertedSection = null;
        }
    }

    @Test
    void createSection() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Section
        var returnedSection = om.readValue(
            restSectionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Section.class
        );

        // Validate the Section in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSectionUpdatableFieldsEquals(returnedSection, getPersistedSection(returnedSection));

        insertedSection = returnedSection;
    }

    @Test
    void createSectionWithExistingId() throws Exception {
        // Create the Section with an existing ID
        section.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkSectionCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        section.setSectionCode(null);

        // Create the Section, which fails.

        restSectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkSectionNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        section.setSectionName(null);

        // Create the Section, which fails.

        restSectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkOrderIndexIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        section.setOrderIndex(null);

        // Create the Section, which fails.

        restSectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllSections() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.save(section);

        // Get all the sectionList
        restSectionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(section.getId())))
            .andExpect(jsonPath("$.[*].sectionCode").value(hasItem(DEFAULT_SECTION_CODE)))
            .andExpect(jsonPath("$.[*].sectionName").value(hasItem(DEFAULT_SECTION_NAME)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)));
    }

    @Test
    void getSection() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.save(section);

        // Get the section
        restSectionMockMvc
            .perform(get(ENTITY_API_URL_ID, section.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(section.getId()))
            .andExpect(jsonPath("$.sectionCode").value(DEFAULT_SECTION_CODE))
            .andExpect(jsonPath("$.sectionName").value(DEFAULT_SECTION_NAME))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX));
    }

    @Test
    void getNonExistingSection() throws Exception {
        // Get the section
        restSectionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingSection() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.save(section);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the section
        Section updatedSection = sectionRepository.findById(section.getId()).orElseThrow();
        updatedSection.sectionCode(UPDATED_SECTION_CODE).sectionName(UPDATED_SECTION_NAME).orderIndex(UPDATED_ORDER_INDEX);

        restSectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSection.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSection))
            )
            .andExpect(status().isOk());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSectionToMatchAllProperties(updatedSection);
    }

    @Test
    void putNonExistingSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(put(ENTITY_API_URL_ID, section.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(section))
            )
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSectionWithPatch() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.save(section);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the section using partial update
        Section partialUpdatedSection = new Section();
        partialUpdatedSection.setId(section.getId());

        partialUpdatedSection.sectionCode(UPDATED_SECTION_CODE).orderIndex(UPDATED_ORDER_INDEX);

        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSection.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSection))
            )
            .andExpect(status().isOk());

        // Validate the Section in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSectionUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSection, section), getPersistedSection(section));
    }

    @Test
    void fullUpdateSectionWithPatch() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.save(section);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the section using partial update
        Section partialUpdatedSection = new Section();
        partialUpdatedSection.setId(section.getId());

        partialUpdatedSection.sectionCode(UPDATED_SECTION_CODE).sectionName(UPDATED_SECTION_NAME).orderIndex(UPDATED_ORDER_INDEX);

        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSection.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSection))
            )
            .andExpect(status().isOk());

        // Validate the Section in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSectionUpdatableFieldsEquals(partialUpdatedSection, getPersistedSection(partialUpdatedSection));
    }

    @Test
    void patchNonExistingSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, section.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(section))
            )
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(section))
            )
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(section)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSection() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.save(section);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the section
        restSectionMockMvc
            .perform(delete(ENTITY_API_URL_ID, section.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return sectionRepository.count();
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

    protected Section getPersistedSection(Section section) {
        return sectionRepository.findById(section.getId()).orElseThrow();
    }

    protected void assertPersistedSectionToMatchAllProperties(Section expectedSection) {
        assertSectionAllPropertiesEquals(expectedSection, getPersistedSection(expectedSection));
    }

    protected void assertPersistedSectionToMatchUpdatableProperties(Section expectedSection) {
        assertSectionAllUpdatablePropertiesEquals(expectedSection, getPersistedSection(expectedSection));
    }
}
