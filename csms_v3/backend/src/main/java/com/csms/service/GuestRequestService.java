package com.csms.service;

import com.csms.entity.GuestRequest;
import com.csms.repository.GuestRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GuestRequestService {

    @Autowired
    private GuestRequestRepository guestRequestRepository;

    public GuestRequest createRequest(GuestRequest request) {
        request.setStatus(GuestRequest.Status.PENDING);
        return guestRequestRepository.save(request);
    }

    public List<GuestRequest> getAllRequests() {
        return guestRequestRepository.findAll();
    }

    public List<GuestRequest> getRequestsByStatus(String status) {
        return guestRequestRepository.findByStatus(GuestRequest.Status.valueOf(status));
    }

    public GuestRequest updateStatus(Long id, String status) {
        return guestRequestRepository.findById(id).map(r -> {
            r.setStatus(GuestRequest.Status.valueOf(status));
            return guestRequestRepository.save(r);
        }).orElseThrow(() -> new RuntimeException("Guest request not found"));
    }
}
