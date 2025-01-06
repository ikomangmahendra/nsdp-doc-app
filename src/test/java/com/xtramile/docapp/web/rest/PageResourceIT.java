package com.xtramile.docapp.web.rest;

import static com.xtramile.docapp.domain.PageAsserts.*;
import static com.xtramile.docapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xtramile.docapp.IntegrationTest;
import com.xtramile.docapp.domain.Page;
import com.xtramile.docapp.repository.PageRepository;
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
 * Integration tests for the {@link PageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PageResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PageRepository pageRepository;

    @Autowired
    private MockMvc restPageMockMvc;

    private Page page;

    private Page insertedPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Page createEntity() {
        return new Page().name(DEFAULT_NAME).title(DEFAULT_TITLE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Page createUpdatedEntity() {
        return new Page().name(UPDATED_NAME).title(UPDATED_TITLE);
    }

    @BeforeEach
    public void initTest() {
        page = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedPage != null) {
            pageRepository.delete(insertedPage);
            insertedPage = null;
        }
    }

    @Test
    void createPage() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Page
        var returnedPage = om.readValue(
            restPageMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(page)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Page.class
        );

        // Validate the Page in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPageUpdatableFieldsEquals(returnedPage, getPersistedPage(returnedPage));

        insertedPage = returnedPage;
    }

    @Test
    void createPageWithExistingId() throws Exception {
        // Create the Page with an existing ID
        page.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(page)))
            .andExpect(status().isBadRequest());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        page.setName(null);

        // Create the Page, which fails.

        restPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(page)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        page.setTitle(null);

        // Create the Page, which fails.

        restPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(page)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllPages() throws Exception {
        // Initialize the database
        insertedPage = pageRepository.save(page);

        // Get all the pageList
        restPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(page.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)));
    }

    @Test
    void getPage() throws Exception {
        // Initialize the database
        insertedPage = pageRepository.save(page);

        // Get the page
        restPageMockMvc
            .perform(get(ENTITY_API_URL_ID, page.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(page.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE));
    }

    @Test
    void getNonExistingPage() throws Exception {
        // Get the page
        restPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingPage() throws Exception {
        // Initialize the database
        insertedPage = pageRepository.save(page);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the page
        Page updatedPage = pageRepository.findById(page.getId()).orElseThrow();
        updatedPage.name(UPDATED_NAME).title(UPDATED_TITLE);

        restPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPage))
            )
            .andExpect(status().isOk());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPageToMatchAllProperties(updatedPage);
    }

    @Test
    void putNonExistingPage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        page.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPageMockMvc
            .perform(put(ENTITY_API_URL_ID, page.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(page)))
            .andExpect(status().isBadRequest());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        page.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(page))
            )
            .andExpect(status().isBadRequest());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        page.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(page)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePageWithPatch() throws Exception {
        // Initialize the database
        insertedPage = pageRepository.save(page);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the page using partial update
        Page partialUpdatedPage = new Page();
        partialUpdatedPage.setId(page.getId());

        partialUpdatedPage.title(UPDATED_TITLE);

        restPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPage))
            )
            .andExpect(status().isOk());

        // Validate the Page in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPageUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPage, page), getPersistedPage(page));
    }

    @Test
    void fullUpdatePageWithPatch() throws Exception {
        // Initialize the database
        insertedPage = pageRepository.save(page);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the page using partial update
        Page partialUpdatedPage = new Page();
        partialUpdatedPage.setId(page.getId());

        partialUpdatedPage.name(UPDATED_NAME).title(UPDATED_TITLE);

        restPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPage))
            )
            .andExpect(status().isOk());

        // Validate the Page in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPageUpdatableFieldsEquals(partialUpdatedPage, getPersistedPage(partialUpdatedPage));
    }

    @Test
    void patchNonExistingPage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        page.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPageMockMvc
            .perform(patch(ENTITY_API_URL_ID, page.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(page)))
            .andExpect(status().isBadRequest());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        page.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(page))
            )
            .andExpect(status().isBadRequest());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPage() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        page.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPageMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(page)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Page in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePage() throws Exception {
        // Initialize the database
        insertedPage = pageRepository.save(page);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the page
        restPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, page.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return pageRepository.count();
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

    protected Page getPersistedPage(Page page) {
        return pageRepository.findById(page.getId()).orElseThrow();
    }

    protected void assertPersistedPageToMatchAllProperties(Page expectedPage) {
        assertPageAllPropertiesEquals(expectedPage, getPersistedPage(expectedPage));
    }

    protected void assertPersistedPageToMatchUpdatableProperties(Page expectedPage) {
        assertPageAllUpdatablePropertiesEquals(expectedPage, getPersistedPage(expectedPage));
    }
}
