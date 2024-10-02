const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyCcsJ3Qx09cNojf5Y-z_t7PR0pfIZhH-P8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

async function  gradeAssignment(assignmentText) {

    console.log("Grading assignment...");
    

    const prompt = `
      You are a college professor grading an assignment on. Evaluate the student's submission based on the following criteria:

    1. Content Accuracy and Relevance (50%): Is the content factually correct, addressing the assignment topic effectively? Does it include relevant examples, if applicable?
    2. Clarity of Explanation (30%): Is the explanation clear, easy to understand, and logically presented?
    3. Grammar and Language (10%): Is the grammar correct, and is the language appropriate for an academic setting?
    4. Creativity and Original Thought (10%): Does the student demonstrate original ideas or creative thinking in their response?
    Note: Content quality and accuracy are more important than length. The assignment should cover the basic aspects of the topic effectively.

    Please grade the assignment on a scale of 100, and convert it into a letter grade from A+ to F.

    Assignment Text: ${assignmentText}
    `;

    // const image = {
    //     inlineData: {
    //       data: Buffer.from(fs.readFileSync("cookie.png")).toString("base64"),
    //       mimeType: "image/png",
    //     },
    //   };

    try {
        const result = await model.generateContent([prompt]);
        // console.log(result.response.text()); 
        return result.response.text();
    } catch (error) {
        console.error("Error during API call:", error.message);
    }
}


module.exports = gradeAssignment;

// Example assignment text
const assignmentText = `
Lab Practical #01:  
Study of basic networking commands and IP configuration.
Practical Assignment #01:
1.	Perform and explain various networking commands listed below:
i.	ipconfig
ii.	ping
iii.	getmac
iv.	systeminfo
v.	traceroute / tracert
vi.	netstat
vii.	nslookup
viii.	hostname
ix.	pathping
x.	arp
1.	ipconfig
Description:
Displays all current TCP/IP network configuration values.
No.	Option	Description
1	ipconfig  -all	Show detailed information.
2	ipconfig  -flushdns	Clears the DNS resolver cache.
3	ipconfig  -release	Release the current DHCP IP address.
4	ipconfig  -renew	Renew the DHCP IP address.
5	ipconfig -displaydns	Show the contents of the DNS resolver cache.
Implementation:

Ipconfig :
 
ipconfig /all :



ipconfig /flushdns :

 
ipconfig /release :
 
ipconfig /renew :
 
ipconfig /displaydns :
 


2.	ping
Description:
Tests connectivity between the requesting host and a target host
No.	Option	Description
1	ping  ip address	Sends ping requests to the specified host and displays the results.
2	ping -t [hostname or IP address]	Pings the specified host continuously until stopped manually.
3	ping -n [count] [hostname or IP address]	Specifies the number of ping requests to send.
4	ping -l [size] [hostname or IP address]		Specifies the size of the ping packet in bytes
5	ping -f [hostname or IP address]	Sends ping requests with the "Don't Fragment" flag set (IPv4 only).
Implementation:
ping www.google.com :
 
ping -t www.google.com :
 
ping -n 5 www.google.com :
 

ping -l 1000 www.google.com :
 
ping -f www.google.com :
 	
3.	Getmac
Description:
Displays the Media Access Control (MAC) address for network adapters on a system
No.	Option	Description
1	getmac -v	Displays detailed information, including connection name, network adapter name, and MAC address.
2	getmac -fo [format]	Specifies the output format. format can be TABLE, LIST, or CSV.
3	getmac -NH	Specifies that the "Column Header" should not be displayed in the output.
Valid only for TABLE and CSV formats.
4	getmac -S 	  Specifies the remote system to connect to.
5	getmac  -?	Displays this help message.
Implementation:

Getmac :
 
getmac /v :
 
getmac /fo CSV :
 
getmac /NH :
 
getmac /S DESKTOP-N26OLKA:
 
getmac  /? :
 

4.	Systeminfo
Description:
Displays detailed configuration information about a computer and its operating system, including hardware properties and OS details
No.	Option	Description
1	systeminfo -nh	Suppresses the header information in the output.
2	systeminfo -s	Specifies the remote system to connect to.
3	systeminfo -U	Specifies the user context under which the command should execute.
4	systeminfo -fo	Specifies the format in which the output is to be displayed. Valid values: "TABLE", "LIST", "CSV".
5	systeminfo -?	Displays this help message
Implementation:
Systeminfo :
 
systeminfo /NH :
 
systeminfo /s DESKTOP-N26OLKA :
 
systeminfo /fo CSV :
 
systeminfo /? :
 
systeminfo /s DESKTOP-N26OLKA /u DOMAIN : 
 
5.	Traceroute/tracert
Description:
Traces the path that packets take from the source to the destination.
No.	Option	Description
1	tracert –d	Performs a traceroute without attempting to resolve IP addresses to hostnames.
2	traceroute -h maximum_hops	Maximum number of hops to search for target.
3	traceroute -w [timeout]	Wait timeout milliseconds for each reply.
4	traceroute -4	Force using IPv4.
5	traceroute -R	Trace round-trip path (IPv6-only).
Implementation:
Tracert :
 

tracert -d google.com :
 
tracert -h 10 google.com : 
 
traceroute -w [timeout]:
 
tracert -4 google.com:
 
tracert -R google.com:
 

6.	netstat
Description:
Displays network connections (both incoming and outgoing), routing tables, interface statistics, masquerade connections, and multicast memberships
No.	Option	Description
1	netstat –a	Displays all active connections and the listening ports on the system.
2	netstat –n	Displays numerical addresses and ports. Avoids resolving hostnames.
3	netstat –r	Displays the routing table, showing the IP routing table entries in the kernel.
4	netstat –t	Displays TCP connections.
5	netstat –u	Displays UDP connections.
Implementation:
Netstat:
 
netstat –a :
 
netstat –n :
 
netstat –r : 
 
netstat –t :
 
netstat –u :
 



7.	nslookup
Description:
Queries DNS to obtain domain name or IP address mapping or other specific DNS records
No.	Option	Description
1	nslookup -type=[record_type] [hostname]	Specifies the type of DNS record to query.
2	nslookup -type=soa 
	Similar to the -type option, specifies the type of DNS record to query.
3	nslookup -type=a
	Lookup for a record. We can also view all the available DNS records for a particular record.
4	nslookup -debug [hostname]	Enables debug mode, providing detailed information about the DNS query and response
5	Nslookup –type=mx  [websit]	NsLookup shows all the DNS records for the website you're visiting
Implementation:
Nslookup : 
 
nslookup -type=soa radhat.com :
 
Nslookup –type=a google.com : 
 
nslookup -debug  google.com   : 
 
nslookup -type=mx google.com :
 
nslookup -type=[record_type] [hostname] :
 
8.	hostname
Description:
Displays the name of the current host system
No.	Option	Description
1	hostname [new_hostname]	Sets the hostname of the system to [new_hostname]
2	hostname /?	Gives the details
3	hostname –s	Displays only the short hostname (without the domain)
4	hostname –i	Displays the IP address(es) associated with the system's hostname.
5	hostname –d	Displays the DNS domain name of the system
Implementation:
Hostname:

 
hostname /?:
 

hostname –s,-I,-d  is not running in my system.


9.	pathping
Description:
Combines the features of ping and tracert.
No.	Option	Description
1	pathping -n	Displays numerical addresses and prevents reverse DNS lookups.
2	pathping -h [maximum_hops]	Specifies the maximum number of hops to search for the target.
3	pathping -q [query_per_hop]	Specifies the number of queries per hop to send.
4	pathping -p	Performs a pathping to each intermediate node to obtain round-trip times.
5	pathping -w [timeout]	Sets the amount of time, in milliseconds, to wait for each reply.
Implementation:
Pathping :
 
pathping -n google.com :
 
pathping -h 2 www.google.com :
 

pathping -w 2000 google.com :
 
pathping -q 2 google.com :
 
pathping -p 2 google.com: 

10.	arp
Description:
Displays and modifies the IP-to-Physical address translation tables used by the Address Resolution Protocol (ARP).
No.	Option	Description
1	arp -a	Displays the ARP cache table with all current entries.
2	arp -g	Same as –a.
3	arp -d	Deletes the host specified by inet_addr. inet_addr may be wildcarded with * to delete all hosts
4	arp -v	Displays verbose output, providing additional information about each ARP cache entry.
5	arp /?	Displays help information
Implementation:
Arp : 
Arp -a:
 
Arp –g:
 
Arp –d :
 

Arp –s :
 
 
Arp /? :
 



`;



// // Call the function to grade the assignment
// gradeAssignment(assignmentText, "Study of basic networking commands and IP configuration");
