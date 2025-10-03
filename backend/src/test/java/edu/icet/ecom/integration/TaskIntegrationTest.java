package edu.icet.ecom.integration;

import edu.icet.ecom.dto.CreateTaskRequest;
import edu.icet.ecom.dto.TaskResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@Testcontainers
@Transactional
class TaskIntegrationTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreateAndRetrieveTasks() throws Exception {
        // Create a task
        CreateTaskRequest request = new CreateTaskRequest("Integration Test Task", "Testing with MySQL");

        String createResponse = mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Integration Test Task"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        TaskResponse createdTask = objectMapper.readValue(createResponse, TaskResponse.class);

        // Retrieve recent tasks
        mockMvc.perform(get("/api/tasks/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Integration Test Task"))
                .andExpect(jsonPath("$[0].completed").value(false));

        // Complete the task
        mockMvc.perform(put("/api/tasks/{id}/complete", createdTask.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));

        // Verify task no longer appears in recent uncompleted tasks
        mockMvc.perform(get("/api/tasks/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
