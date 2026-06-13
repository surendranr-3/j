package com.csms.service;

import com.csms.entity.Car;
import com.csms.entity.User;
import com.csms.repository.CarRepository;
import com.csms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    public Car addCar(Long userId, Car car) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        car.setUser(user);
        return carRepository.save(car);
    }

    public List<Car> getCarsByUser(Long userId) {
        return carRepository.findByUserId(userId);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public void deleteCar(Long carId) {
        carRepository.deleteById(carId);
    }
}
