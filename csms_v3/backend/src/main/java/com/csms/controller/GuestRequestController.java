package com.csms.controller;

import com.csms.entity.GuestRequest;
import com.csms.service.GuestRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guest-requests")
@CrossOrigin(origins = "*")
public class GuestRequestController {

    @Autowired
    private GuestRequestService guestRequestService;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody GuestRequest request) {
        try {
            return ResponseEntity.ok(guestRequestService.createRequest(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<GuestRequest>> getAllRequests(
            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(guestRequestService.getRequestsByStatus(status));
        }
        return ResponseEntity.ok(guestRequestService.getAllRequests());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(guestRequestService.updateStatus(id, body.get("status")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
