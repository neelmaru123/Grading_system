const fetch = require('node-fetch');

// Function to call the Flask API
async function callPythonAPI(data) {
    try {
        const response = await fetch('http://127.0.0.1:5000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.status === 'success') {
            console.log('Grade:', result.data.grade);
            console.log('Remarks:', result.data.remarks);
            return {
                grade: result.data.grade,
                remarks: result.data.remarks
            }
        } else {
            return {
                error: result.message
            }
        }
    } catch (error) {
        console.error('Error calling Python API:', error);
    }
}

// // Input data: Single sample and assignment
// const sample = {
//     sample: `Introduction to Network Devices
//     Define what network devices are and their importance in computer networks.
// Briefly mention the types of network devices that will be discussed (e.g., Hub, Switch, Router, Gateway).
// Detailed Comparison of Network Devices
// Hub vs. Switch
// Explain the basic functions of each device.
// Highlight key differences in terms of data transmission methods, port numbers, collision domains, and operational modes.
// Switch vs. Router
// Describe how switches manage local traffic and how routers direct traffic between different networks.
// Discuss differences in addressing (MAC vs. IP) and security features.
// Router vs. Gateway
// Clarify the roles of routers in managing data packets and gateways in connecting disparate networks.
// Explain protocol translation and complexity differences.
// Working Mechanism of Each Device
// Provide a concise explanation of how each device operates:
// Switch: Discuss its role in connecting devices within a LAN and how it forwards data based on MAC addresses.
// Router: Explain how it determines the best path for data packets using routing tables and protocols.
// Gateway: Describe its function in enabling communication between networks using different protocols.
// Use Cases and Applications
// Discuss scenarios where each device is typically used (e.g., hubs in small networks, switches in larger LANs, routers for internet connectivity, gateways for protocol conversion).
// Mention any specific technologies or protocols associated with each device.
// Advantages and Disadvantages
// List the pros and cons of each device type to provide a balanced view:
// For example, hubs are easy to install but cannot filter traffic; switches improve performance but can be more expensive; routers provide security features but may be slower due to processing overhead.
// Conclusion
// Summarize the key points made throughout the assignment.
// Emphasize the significance of understanding these devices for effective network management.
// Example Description
// Introduction to Network Devices
// Network devices are essential hardware components that facilitate communication between various devices within a computer network. They play critical roles in managing data flow and ensuring efficient connectivity across local and wide area networks. This assignment will explore three primary types of network devices: Hubs, Switches, Routers, and Gateways.
// Comparison of Network Devices
// Hub vs. Switch:
// A hub is a basic networking device that broadcasts data to all connected devices within a network segment, operating at Layer 1 (Physical Layer) of the OSI model. In contrast, a switch operates at Layer 2 (Data Link Layer) and intelligently forwards data only to the intended recipient based on MAC addresses.
// Switch vs. Router:
// While switches manage traffic within a local area network by forwarding frames based on MAC addresses, routers operate at Layer 3 (Network Layer) and route packets between different networks using IP addresses.
// Router vs. Gateway:
// A router directs data packets based on their destination IP addresses, while a gateway serves as an entry point between different networks that may use different protocols, facilitating communication through protocol translation.
// Working Mechanism
// A switch learns the MAC addresses of connected devices to minimize collisions and improve efficiency.
// A router analyzes incoming packets to determine their destination using routing tables.
// A gateway translates protocols to enable seamless communication between heterogeneous networks.
// Use Cases
// Hubs are often used in small home networks where simplicity is key; switches are common in office environments for efficient local traffic management; routers connect local networks to the internet; gateways are crucial for linking different network architectures.
// Advantages and Disadvantages
// Hubs are inexpensive but cannot filter traffic effectively.
// Switches enhance performance but may incur higher costs.
// Routers offer robust security features but can introduce latency due to processing requirements.
// Conclusion
// Understanding the functionality and differences among network devices is vital for effective network design and management. Each device serves unique purposes that contribute to the overall performance and security of computer networks.
// Final Note
// By structuring the assignment description this way, faculty can ensure that students receive a thorough understanding of network devices while also providing clear comparisons and practical insights into their applications. This approach will help students grasp complex concepts more easily and prepare them for real-world networking scenarios.`,
//     assignment: `DARSHAN INSTITUTE OF ENGINEERING & TECHNOLOGY
// Semester 5th | Practical Assignment | Computer Networks (2101CS501)
// Date: 04/07/2024
// 1 Enrollment No: - 22010101110 | B.Tech. CSE
// Lab Practical #03:
// Study of different network devices in detail.
// Practical Assignment #03:
// 1. Give difference between below network devices.
// • Hub and Switch
// • Switch and Router
// • Router and Gateway
// 2. Working of below network devices:
// • Switch
// • Router
// • Gateway
// Hub and Switch
// No. Hub Switch
// 1 Broadcasts data to all connected devices
// (broadcast transmission).
// Supports unicast, multicast,
// and broadcast transmissions.
// 2 Typically has 4 to 12 ports. Can have 24 to 48 ports.
// 3 All ports share a single collision domain. Different ports have their own collision
// domains.
// 4 Operates in half duplex mode. Operates in full duplex mode.
// 5 Doesn’t provide packet filtering. Provides packet filtering.
// Switch and Router
// No. Switch Router
// 1 Forwards data within a network (local
// communication).
// Routes data between networks, including
// the internet.
// 2 Doesn’t store IP addresses; focuses on
// MAC addresses.
// Stores and manages IP addresses.
// 3 Manages local traffic efficiently. Handles traffic between different
// networks.
// 4 Basic security; doesn’t filter traffic as
// extensively.
// Provides security features like NAT,
// firewall, and access control.
// 5 Essential for connecting networks and
// accessing the internet.
// Used within a network to connect devices
// (computers, printers, etc.).
// DARSHAN INSTITUTE OF ENGINEERING & TECHNOLOGY
// Semester 5th | Practical Assignment | Computer Networks (2101CS501)
// Date: 04/07/2024
// 2 Enrollment No: - 22010101110 | B.Tech. CSE
// Router and Gateway
// No. Router Gateway
// 1 A router is a hardware device responsible
// for receiving, analyzing, and forwarding
// data packets to other networks.
// A gateway serves as a “gate” between
// networks, enabling traffic flow.
// 2 It determines the destination IP address of
// the packet and finds the best way to
// transfer it using forwarding tables and
// headers.
// It acts as an entrance for nodes in the
// network, especially when different
// protocols are involved.
// 3 outers operate in local area networks
// (LANs) and wide area networks (WANs).
// Gateways handle protocol conversion,
// making them more complex than routers
// or switches
// 4 They support dynamic routing and operate
// at layers 3 and 4 of the OSI model.
// In workplaces, gateways route traffic from
// workstations to external networks. At
// home, they provide internet access.
// Working of below network devices:
// 1. Switch
//  switch is a device that connects multiple devices within a local area network (LAN) and
// efficiently manages data traffic between them. It primarily operates at the Data Link layer (Layer
// 2) of the OSI model. A switch learns the MAC addresses of devices connected to its ports by
// examining incoming data packets. It records the source MAC address and the corresponding port
// in its MAC address table. When a data packet arrives, the switch checks the destination MAC
// address and forwards the packet to the appropriate port based on its MAC address table. If the
// destination MAC address is unknown, the switch floods the packet to all ports except the source
// port. This process minimizes network collisions and improves efficiency by ensuring data is sent
// only to the intended recipient. Some switches, known as Layer 3 switches, also perform routing
// functions based on IP addresses, managing traffic between different subnets.
// DARSHAN INSTITUTE OF ENGINEERING & TECHNOLOGY
// Semester 5th | Practical Assignment | Computer Networks (2101CS501)
// Date: 04/07/2024
// 3 Enrollment No: - 22010101110 | B.Tech. CSE
// 2. Router
//  A router is a networking device that directs data packets between different networks, operating
// primarily at the Network layer (Layer 3) of the OSI model. It determines the best path for data to
// travel from the source to the destination using routing tables and protocols. When a data packet
// arrives at a router, the router examines the packet's destination IP address and consults its
// routing table to find the most efficient route. It then forwards the packet to the next hop, which
// could be another router or the destination device.
// Routers use various routing protocols, such as OSPF, BGP, and RIP, to communicate with other
// routers, sharing information about network topology and ensuring optimal path selection. Routers
// also perform Network Address Translation (NAT) to enable multiple devices on a local network to
// share a single public IP address. Additionally, they provide security features like firewalls and VPN
// support to protect network traffic. By efficiently managing data traffic, routers play a crucial role
// in maintaining the connectivity and performance of both local and wide-area networks (WANs).
// 3. Gateway
//  A gateway is a network node that connects two different networks using different protocols,
// enabling communication between them. It operates at multiple layers of the OSI model, typically
// at the Transport, Session, and Application layers. The primary function of a gateway is protocol
// translation, allowing data to flow seamlessly between networks that otherwise couldn't
// communicate.
// When a data packet arrives at a gateway, the gateway reads the packet's protocol and translates
// it into a protocol compatible with the destination network. For example, a gateway can convert
// email messages from one email system to another or translate IP addresses for traffic moving
// between a private network and the internet.
// Gateways also manage data traffic, perform data encryption and decryption, and provide security
// features such as firewalls. They can act as a proxy server, filtering and caching content to
// improve network performance. By handling protocol conversions and providing secure, efficient
// data transmission, gateways are essential for enabling communication across diverse network
// environments.`,
// };

// // Call the function
// callPythonAPI(sample);

module.exports = callPythonAPI;
