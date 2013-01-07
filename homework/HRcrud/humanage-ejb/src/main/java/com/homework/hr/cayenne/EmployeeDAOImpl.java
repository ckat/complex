package com.homework.hr.cayenne;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import javax.ejb.Remote;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.homework.hr.dao.EmployeeDAO;
import com.homework.hr.entities.Employee;

/**
 * Session Bean implementation class EmployeeDAOImpl
 */
@Stateless
@Remote
public class EmployeeDAOImpl implements EmployeeDAO, Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = -2240136453630321239L;

	@PersistenceContext(unitName="HR")
	EntityManager entityManager;
	/**
     * Default constructor. 
     */
    public EmployeeDAOImpl() {
    	
    
    }

	@SuppressWarnings("unchecked")
	public String getVersion() {

		StringBuilder sb = new StringBuilder();
		Query query = entityManager.createNamedQuery("Employee.allEmployees");

		Collection<Employee> employees = query.getResultList();
		
		for (Employee employee : employees)
			sb.append(employee.toString()).append(", ");
		return sb.toString();
	}

	@Override
	public List<Employee> getAllEmployeesWithPaging(Integer pageSize,
			Integer pageNum) {
		Query query = entityManager.createNamedQuery("Employee.allEmployees");
		query.setFirstResult(pageNum * pageSize);
		query.setMaxResults(pageSize);
		List<Employee> employees = query.getResultList();
		return employees;
	}

	@Override
	public List<Employee> getAllEmployees() {
			return getAllEmployeesWithPaging(Integer.MAX_VALUE, 0);
	}

	@Override
	public Long getEmployeesCount() {
		Query query = entityManager.createQuery("SELECT COUNT(*) FROM Employee emp");
		return (Long) query.getSingleResult();
	}



}
