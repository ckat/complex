package com.homework.hr.dao;

import java.util.List;

import com.homework.hr.entities.Employee;

public interface EmployeeDAO {
	String getVersion();
	List<Employee> getAllEmployeesWithPaging(Integer pageSize, Integer pageNum);
	List<Employee> getAllEmployees();
	Long getEmployeesCount();
}
