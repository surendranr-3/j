package com.csms.service;

import com.csms.entity.Car;
import com.csms.entity.ServiceRequest;
import com.csms.entity.User;
import com.csms.repository.CarRepository;
import com.csms.repository.ServiceRequestRepository;
import com.csms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarRepository carRepository;

    public ServiceRequest createRequest(Long userId, Long carId, String serviceType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        ServiceRequest req = new ServiceRequest();
        req.setUser(user);
        req.setCar(car);
        req.setServiceType(serviceType);
        req.setRequestDate(LocalDate.now());
        req.setStatus(ServiceRequest.Status.PENDING);
        return serviceRequestRepository.save(req);
    }

    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    public List<ServiceRequest> getRequestsByUser(Long userId) {
        return serviceRequestRepository.findByUserId(userId);
    }

    public List<ServiceRequest> getRequestsByStatus(String status) {
        return serviceRequestRepository.findByStatus(ServiceRequest.Status.valueOf(status));
    }

    public ServiceRequest updateStatus(Long id, String status) {
        return serviceRequestRepository.findById(id).map(req -> {
            req.setStatus(ServiceRequest.Status.valueOf(status));
            return serviceRequestRepository.save(req);
        }).orElseThrow(() -> new RuntimeException("Request not found"));
    }
}
