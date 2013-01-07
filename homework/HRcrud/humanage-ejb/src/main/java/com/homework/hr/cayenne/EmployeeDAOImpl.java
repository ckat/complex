package com.homework.hr.cayenne;

import java.io.Serializable;
import java.util.List;

import javax.ejb.Remote;
import javax.ejb.Stateless;

import org.apache.cayenne.ObjectContext;
import org.apache.cayenne.access.DataContext;
import org.apache.cayenne.query.SelectQuery;

import com.homework.hr.dao.EmployeeDAO;
import com.homework.hr.entities.Employees;

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
	private DataContext context;
	/**
     * Default constructor. 
     */
    public EmployeeDAOImpl() {
    	context = DataContext.createDataContext("HrDomain");
        // TODO Auto-generated constructor stub
    }

	@Override
	public String getVersion() {
		// TODO Auto-generated method stub
		SelectQuery query = new SelectQuery(Employees.class);
		List<Employees> list = context.performQuery(query);
		StringBuilder sb = new StringBuilder();
		for (Employees employee : list)
			sb.append(employee.getLastName());
		return sb.toString();
	}

}
