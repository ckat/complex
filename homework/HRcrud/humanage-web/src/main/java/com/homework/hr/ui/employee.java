package com.homework.hr.ui;

import java.io.IOException;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.homework.hr.dao.EmployeeDAO;
import com.homework.hr.entities.Employee;
import com.homework.hr.entities.Job;

/**
 * Servlet implementation class employee
 */
@WebServlet("/employee")
public class employee extends HttpServlet {
	private static final long serialVersionUID = 1L;
	@EJB
	EmployeeDAO employeeDAO;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public employee() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {	
		String type = request.getParameter("type");
		String ejson = "";
		type = (type != null)? type.toLowerCase(): "list";
		
		if (type.equals("list")){
		 ejson = getEmployeeList(request);
		}else{
//			if (type.equals("COUNT"))
			{
				ejson = getEmployeeCount(request);
			}
		}
		response.getOutputStream().print(ejson);
		
	}

	private String getEmployeeCount(HttpServletRequest request) {
		Gson json = new Gson();
		String ejson = json.toJson(employeeDAO.getEmployeesCount());
		return ejson;
	}

	private String getEmployeeList(HttpServletRequest request) {
		Integer pageSize = 20;
		Integer pageNum = 0;
		String requestedCount = request.getParameter("count");
		String requestedPage = request.getParameter("page");
		
		if (requestedCount != null)
			pageSize = Integer.parseInt(requestedCount);
		if (requestedPage != null)
			pageNum = Integer.parseInt(requestedPage);
		
		List<Employee> employees = employeeDAO.getAllEmployeesWithPaging(pageSize, pageNum);
		
		ExclusionStrategy strategy = new ExclusionStrategy() {
			
			@Override
			public boolean shouldSkipField(FieldAttributes arg0) {
				return false;
			}
			
			@Override
			public boolean shouldSkipClass(Class<?> clazz) {
				return (clazz == Job.class);
			}
		};
		
		Gson json = new GsonBuilder().setExclusionStrategies(strategy).create();
		
//		String ejson = "{}";
		String ejson = json.toJson(employees);
		return ejson;
	}

}
