# Sensors and Perception

Humans use five senses to understand the world. Robots need sensors too — but instead of eyes and ears, they use cameras and microphones. Instead of a sense of balance, they use a gyroscope. Let's explore how robots "feel" the world around them.

## Sensing the World

Imagine you are blindfolded in an unfamiliar room. You would stretch out your arms, listen carefully, and try to feel the floor beneath your feet. You would use every sense available to build a picture of your surroundings.

A robot does the same thing — but with electronic sensors. Every sensor gives the robot one piece of information about the world. Combine enough sensors, and the robot builds a complete picture it can act on.

## Types of Sensors

**Cameras** are the most common sensor on robots. They work just like the camera on your phone — they capture images or video. A robot uses cameras to recognize objects, people, and obstacles.

Some robots use **two cameras** placed side by side (stereo cameras) — just like your two eyes. The slight difference between what each camera sees lets the robot calculate how far away things are.

**LiDAR** (Light Detection and Ranging) shoots invisible laser beams in all directions and measures how long they take to bounce back. This creates a 3D "point cloud" map of everything around the robot. You have probably seen this on self-driving cars — the spinning device on top is a LiDAR sensor.

**IMU (Inertial Measurement Unit)** tells the robot which way is up, how fast it is moving, and whether it is tilting. Your phone has a small IMU inside — it's what rotates the screen when you tilt your phone.

**Touch sensors** in a robot's hands tell it when it is touching something and how hard it is pressing. This is important for picking up fragile objects without crushing them.

## Sensor Fusion

No single sensor gives a complete picture. Each sensor has weaknesses:
- Cameras fail in the dark
- LiDAR struggles with transparent surfaces like glass
- IMU drifts over time

**Sensor fusion** is the process of combining data from multiple sensors to get a more reliable picture than any single sensor could provide.

Think of three witnesses to an event — each saw something slightly different, but together their accounts give you a much clearer picture of what happened.

Robots use mathematical algorithms (like the **Kalman Filter**) to combine sensor readings intelligently, weighting each sensor based on how reliable it is at any given moment.

## Key Takeaway

Sensors are a robot's connection to the physical world. Without good sensors, a robot is blind and deaf. The more sensors a robot has — and the better it combines their data — the more accurately it understands its environment and the better it can act within it.
