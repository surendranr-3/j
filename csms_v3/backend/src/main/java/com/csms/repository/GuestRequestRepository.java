package com.csms.repository;

import com.csms.entity.GuestRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuestRequestRepository extends JpaRepository<GuestRequest, Long> {
    List<GuestRequest> findByStatus(GuestRequest.Status status);
}
