<script lang="ts">
    import bcast from "@windy/broadcast";
    import { map, markers } from '@windy/map';
    import { onMount, onDestroy } from 'svelte';
    import config from './pluginConfig';
    import buoyInfo from './buoys';
    import Papa from 'papaparse'; 

    const { title } = config;

    let marker: L.Marker | null = null;
    let loader = false;
    let buoyMarkers = [];
    let buoyData = [];

    // Fetch CSV data asynchronously
    async function fetchCSVData() {
        try {
            const response = await fetch('https://drive.google.com/file/d/1a7DnLZ9B2xRejXgbnGV9Z15C4qLyl3qr/view?ths=true'); // Change 'Data.csv' to the actual path of your CSV file
            console.log('Fetch response:', response);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV file: ${response.status} ${response.statusText}`);
            }
            
            const csvText = await response.text();
            console.log('CSV text:', csvText);
            
            const parsedData = Papa.parse(csvText, { delimiter: ';', header: true }).data;
            console.log('Parsed CSV data:', parsedData);
            
            buoyData = parsedData;
        } catch (error) {
            console.error('Error fetching or parsing CSV data:', error);
        }
    }

    
    onMount(() => {
        // Define custom icon for arrow marker
        const arrowIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png', // URL to your arrow icon image
            iconSize: [22, 22], // Size of the icon
            iconAnchor: [10, 4] // Anchor point of the icon
        });

        // Loop through each buoy data and add a marker for each
        buoyInfo.forEach(buoy => {
            const { ID, name, lat, lon } = buoy;
            const buoyMarker = L.marker([lat, lon], {icon: arrowIcon}).addTo(map);
            buoyMarker.bindPopup(`<b>${name}</b>`).openPopup(); // Popup with buoy name
            buoyMarkers.push(buoyMarker);
        });
        
        // Fetch and parse CSV data
        fetchCSVData();

        // Set the map location
        map.setView([47,2],6)
    });

    onDestroy(() => {
        // Your plugin will be destroyed
        // Make sure you cleanup after yourself
        if(marker) {
            marker.remove();
            marker = null;
        }
        buoyMarkers.forEach(buoyMarker => {
            map.removeLayer(buoyMarker);
        });
    });
</script>

<style lang="less">
    p {
        line-height: 1.8;
        color: rgb(251, 255, 0);
    }
    code {
        color: rgb(139, 100, 211);
    }
    img {
        display: block;
        width: 70%;
        margin: 0 auto;
    }

    /* Table styling */
    table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
    }

    /* Header row styling */
    th {
        background-color: #8f8f8f;
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    /* Data row styling */
    td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    /* Hover effect */
    tr:hover {
        background-color: #e9961a;
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

    <p class="mt-30 mb-30">
        <img src="https://cdn-icons-png.flaticon.com/512/1816/1816116.png" alt="Buoy" />
    </p>

    <p class="size-l">
        Congratulations, you have just launched your first Windy plugin!
    </p>

    <hr />

    {#if buoyData.length > 0}
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
        {#each buoyData as buoy}
            <tr>
            <td>{buoy.Date}</td>
            <td>{buoy['H1/3']}</td>
            <td>{buoy.Hmax}</td>
            <td>{buoy['Th1/3']}</td>
            <td>{buoy.DirPic}</td>
            <td>{buoy.EtalPic}</td>
            <td>{buoy.TempMer}</td>
            </tr>
        {/each}
        </tbody>
    </table>
    {:else}
    <p>No data available</p>
    {/if}
    
</section>