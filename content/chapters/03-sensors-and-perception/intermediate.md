# Sensors and Perception

A robot without sensors is blind, deaf, and numb. Sensors are the interface between a robot's internal computational world and the physical reality it must navigate. Modern humanoid robots carry a rich array of sensors — each capturing a different dimension of their environment — and sophisticated algorithms that fuse this information into a coherent understanding of the world.

## Sensing the World

Perception is more than reading sensor data. It is the process of interpreting that data to answer useful questions: Where am I? What objects are around me? Is this surface safe to step on? What is this person's hand reaching for?

Robots face a fundamental challenge that humans don't consciously notice: sensors are noisy and incomplete. A camera pixel represents light intensity, not object identity. A LiDAR return is a distance measurement, not a label. Turning raw measurements into meaningful representations — "there is a cup on that table at position (1.2, 0.8, 0.9)" — requires significant computation.

The goal of perception is to produce a **world model**: an internal representation of the robot's environment that is accurate enough to support good decisions and actions.

## Types of Sensors

**Cameras** are the most information-rich sensors available. A modern camera can capture millions of pixels at 60 or more frames per second. RGB cameras capture color images, while depth cameras (using structured light or time-of-flight) also measure the distance to each pixel. Stereo cameras use two lenses to compute depth the way human eyes do — by comparing slightly different images of the same scene.

Cameras excel at texture, color, and fine detail recognition. They are also the primary sensor for face recognition, object identification, and reading labels or text. Their weakness is performance in low light, heavy rain, or direct sunlight — conditions where image quality degrades sharply.

**LiDAR (Light Detection and Ranging)** emits pulses of laser light and measures the time each pulse takes to return after bouncing off an object. The result is a precise 3D point cloud of the environment — millions of distance measurements per second, accurate to within centimeters. LiDAR is weather-resistant compared to cameras and provides excellent spatial accuracy for mapping and navigation.

The tradeoff: LiDAR is expensive, has no color information, and struggles with transparent or highly reflective surfaces (glass, mirrors, water).

**IMU (Inertial Measurement Unit)** combines an accelerometer and a gyroscope to measure the robot's linear acceleration and angular velocity. IMUs update at very high rates (up to 1000Hz) and provide critical information for balance and orientation. When a humanoid robot is walking, its IMU tells the controller which way is "down" and how fast the body is tilting — essential for preventing falls.

**Force/torque sensors** embedded in joints or end-effectors measure the forces and torques acting at that point. A force sensor in the wrist tells the robot how hard it is gripping an object. Sensors in the feet measure ground contact forces, which are used by walking controllers to detect when a foot has landed and adjust gait accordingly.

**Proprioception** refers to the robot's sense of its own body — the positions, velocities, and forces at every joint. Joint encoders measure the rotation angle of each motor shaft with high precision. This data feeds the low-level controller continuously, forming the foundation of all motion control.

## Sensor Fusion

No single sensor tells the complete story. Sensor fusion is the process of combining data from multiple sensors to produce estimates that are more accurate and robust than any individual sensor could provide.

The classic algorithm for sensor fusion in robotics is the **Kalman Filter** and its variants. A Kalman filter maintains a probabilistic estimate of the robot's state (position, velocity, orientation) and updates it as new sensor measurements arrive. It weighs each measurement by its expected reliability — trusting a precise encoder reading more than a noisy accelerometer for position, but trusting the IMU more for fast dynamics.

For humanoid robots, a critical fusion task is **state estimation**: computing the robot's full body pose — the position and orientation of every link — from IMU data, joint encoders, and foot contact sensors. Without accurate state estimation, walking controllers cannot function correctly.

**Visual-Inertial Odometry (VIO)** fuses camera images and IMU data to estimate the robot's movement through space. As the robot moves, features in the image shift predictably; by tracking these shifts and combining them with IMU measurements, the system builds a continuous estimate of position and orientation — even in environments with no GPS signal.

Modern Physical AI systems increasingly use learned perception — neural networks trained on large datasets that can classify objects, detect humans, estimate poses, and segment scenes directly from sensor data. These learned modules complement classical fusion algorithms and have dramatically improved robustness in real-world conditions.
