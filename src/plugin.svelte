<script lang="ts">
    import bcast from "@windy/broadcast";
    import { map } from '@windy/map';
    import { onMount, onDestroy } from 'svelte';
    import config from './pluginConfig';
    import buoyInfo from './buoys';

    const { title } = config;
    // URL of the page you want to scrape
    const url = "http://localhost:4000/scrape-data";

    let marker: L.Marker | null = null;
    let loader = false;
    let buoyMarkers = [];
    let buoyData = [];
    let selectedBuoyData = []; 
    let selectedBuoyName = [];
    let selectedBuoyID = [];

    // Function to get icon based on zoom level
    function getIcon(size) {
        return L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        });
    }

    // Function to update icons on zoom
    function updateIconsOnZoom() {
        const zoom = map.getZoom();
        const iconSize = 8 + zoom * 2; // Calculate icon size dynamically
        buoyMarkers.forEach(({marker}) => {
            marker.setIcon(getIcon(iconSize));
        });
    }

    // Define custom icon for markers
    const normalIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png',
        iconSize: [22, 22], // Size of the icon
        iconAnchor: [11, 11] // Anchor point of the icon
    });

    const selectedIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png',
        iconSize: [42, 42], // Larger size for selected
        iconAnchor: [21, 21]
    });
    
    async function fetchData(){
        try {
            const response = await fetch(url);
            if (response.ok) {
                buoyData = await response.json();
                updateMarkerPopups(); // Update markers once data is fetched
            } else {
                console.error('Failed to fetch data from server.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function updateMarkerPopups() {
        buoyMarkers.forEach(({ marker, ID }) => {
            const buoyDataEntry = buoyData[ID];

            // Ensure the data exists and has the expected format
            let hs = 'N/A';
            let tp = 'N/A';
            let dir = 'N/A';
            if (buoyDataEntry && buoyDataEntry.length > 0 && buoyDataEntry[0].length > 1) {
                hs = buoyDataEntry[0][1];
                tp = buoyDataEntry[0][3];
                dir = buoyDataEntry[0][4];
            }

            // Update the popup content dynamically with the fetched data
            marker.bindPopup(`
                <b>${marker.getPopup().getContent().split('<br>')[0]}</b><br>
                <b>Hs:</b> ${hs} | <b>Tp:</b> ${tp} | <b>Dir:</b> ${dir}
            `);
        });
    }

    onMount(() => {
        // Loop through each buoy data and add a marker for each
        buoyInfo.forEach(buoy => {
            const { ID, name, lat, lon, href } = buoy;
            const buoyMarker = L.marker([lat, lon], { icon: getIcon(8+map.getZoom()*2) }).addTo(map);

            // Add a basic popup (or empty) to be updated later
            buoyMarker.bindPopup(`<b>${name}</b>`);

            // Add each marker in a single array
            buoyMarkers.push({ marker: buoyMarker, ID }); // Keep marker and ID together

            // Handle marker click event for selection
            buoyMarker.on('click', () => {
                // buoyMarkers.forEach(({ marker }) => marker.setIcon(normalIcon)); // Reset icons
                // buoyMarker.setIcon(selectedIcon); // Highlight selected marker
                selectedBuoyData = buoyData[ID] || []; // Update selected data using the dictionary
                selectedBuoyName = name; // Update selected data
                selectedBuoyID = ID;
            });
        });
        
        // Fetch and parse data on mount
        fetchData(); 

        // Update icons on zoom change
        map.on('zoomend', updateIconsOnZoom);

        // Set the map location
        // map.setView([47,2],6)
    });

    onDestroy(() => {
        // Your plugin will be destroyed
        // Make sure you cleanup after yourself
        // if(marker) {
        //     marker.remove();
        //     marker = null;
        // }
        buoyMarkers.forEach(({marker}) => {
            map.removeLayer(marker);
        });
    });

</script>

<style lang="less">
    p {
        line-height: 1.8;
        color: rgb(231, 214, 166);
    }

    img {
        display: block;
        margin: 0 auto;
    }
    
    /* Table container styling */
    .table-container {
        width: 100%;
        overflow-x: auto; /* Allow horizontal scrolling for smaller screens */
        margin: 20px 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for better depth */
        border-radius: 8px; /* Rounded corners */
    }

    /* Table styling */
    table {
        width: 100%;
        border-collapse: collapse;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #fff; /* White background for the table */
        border-radius: 8px; /* Rounded corners */
        overflow: hidden; /* Prevent overflow of table contents */
    }

    /* Header row styling */
    th {
        background-color: rgb(207, 190, 141); /* Light green background */
        color: white; /* White text color */
        border-bottom: 2px solid #ddd;
        text-align: center;
        padding: 12px 15px; /* Padding for header cells */
        font-weight: bold; /* Bold text */
    }

    /* Data row styling */
    td {
        border-bottom: 1px solid #b8b7b7; /* Light border between rows */
        text-align: center;
        padding: 10px 15px; /* Padding for data cells */
    }

    /* Zebra striping for table rows */
    tr:nth-child(even) {
        background-color: #666666; /* Light gray background for even rows */
    }
    tr:nth-child(odd) {
        background-color: #808080; /* Light gray background for even rows */
    }

    /* Hover effect for table rows */
    tr:hover {
        background-color: #ad8b64; /* Gray background on hover */
    }

    /* Responsive design */
    @media (max-width: 600px) {
        th, td {
            font-size: 14px; /* Smaller font size for smaller screens */
        }
    }
</style>

<div class="plugin__mobile-header">
    { title }
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={ () => bcast.emit('rqstOpen', 'menu') }
    >
    { title }
    </div>

    <p class="mt-5 mb-20">
        <img src="https://cdn-icons-png.flaticon.com/512/1816/1816116.png" alt="Buoy" width="128"/>
    </p>

    {#if selectedBuoyName.length > 0}
    <h1>
        {selectedBuoyName} ({selectedBuoyID})
    </h1> 
    {:else}
    <h1>
        Please select a wave buoy.
    </h1>
    {/if}

    <hr />

    {#if selectedBuoyData.length > 0}
    <table>
        <thead>
        <tr>
            <th>Date</th>
            <th>Hs</th>
            <th>Hmax</th>
            <th>Tp</th>
            <th>Dir.</th>
            <th>Spread</th>
            <th>Temp.</th>
        </tr>
        </thead>
        <tbody>
        {#each selectedBuoyData as buoy}
            <tr>
            <td>{buoy[0]}</td>
            <td>{buoy[1]}</td>
            <td>{buoy[2]}</td>
            <td>{buoy[3]}</td>
            <td>{buoy[4]}</td>
            <td>{buoy[5]}</td>
            <td>{buoy[6]}</td>
            </tr>
        {/each}
        </tbody>
    </table>
    {:else}
    <p>No data available</p>
    {/if}

    <hr />
    
    <p class="mt-20 mb-5">
        <img src="https://urbanvitaliz.fr/static/img/partners/logo_cerema.png" alt="Cerema" width="256"/>
    </p>

</section>