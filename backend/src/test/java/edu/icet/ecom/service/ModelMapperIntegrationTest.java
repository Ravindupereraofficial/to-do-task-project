package edu.icet.ecom.service;

import edu.icet.ecom.dto.CreateTaskRequest;
import edu.icet.ecom.dto.TaskResponse;
import edu.icet.ecom.entity.Task;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ModelMapperIntegrationTest {

    @Autowired
    private ModelMapper modelMapper;

    @Test
    void shouldMapCreateTaskRequestToTask() {
        // Given
        CreateTaskRequest request = new CreateTaskRequest("Test Task", "Test Description");

        // When
        Task task = modelMapper.map(request, Task.class);

        // Then
        assertNotNull(task);
        assertEquals("Test Task", task.getTitle());
        assertEquals("Test Description", task.getDescription());
        assertNotNull(task.getCreatedAt());
        assertFalse(task.getCompleted());
    }

    @Test
    void shouldMapTaskToTaskResponse() {
        // Given
        Task task = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .createdAt(LocalDateTime.now())
                .completed(false)
                .build();

        // When
        TaskResponse response = modelMapper.map(task, TaskResponse.class);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Task", response.getTitle());
        assertEquals("Test Description", response.getDescription());
        assertEquals(task.getCreatedAt(), response.getCreatedAt());
        assertFalse(response.getCompleted());
    }
}
