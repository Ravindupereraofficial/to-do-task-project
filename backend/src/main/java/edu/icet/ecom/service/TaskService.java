package edu.icet.ecom.service;

import edu.icet.ecom.dto.CreateTaskRequest;
import edu.icet.ecom.dto.TaskResponse;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    List<TaskResponse> getRecentUncompletedTasks();

    TaskResponse completeTask(Long id);

    TaskResponse updateTask(Long id, CreateTaskRequest request);
}
