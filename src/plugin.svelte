<script lang="ts">
    import bcast from "@windy/broadcast";
    import { map, markers } from '@windy/map';
    import { onMount, onDestroy } from 'svelte';
    import config from './pluginConfig';
    import buoyInfo from './buoys';

    const { title } = config;

    let marker: L.Marker | null = null;
    let loader = false;
    let buoyMarkers = [];
    let buoyData = [];

    // Fetch data asynchronously
    let campaignData = [];

    async function fetchCampaignData() {
        try {
            const response = await fetch('https://www.allosurf.net/meteo/live/les-pierres-noires-bouee-fr-02911.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
            }

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            
            // Example of extracting data based on the structure of the HTML
            // Adjust selectors according to the actual HTML structure of the page
            const tableRows = doc.querySelectorAll('table tr');
            campaignData = Array.from(tableRows).map(row => {
                const cells = row.querySelectorAll('td');
                return Array.from(cells).map(cell => cell.textContent.trim());
            });

        } catch (error) {
            console.error('Error fetching campaign data:', error);
        }
    }
    
    onMount(() => {
        // Define custom icon for arrow marker
        const buoyIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png', // URL to your arrow icon image
            iconSize: [22, 22], // Size of the icon
            iconAnchor: [11, 11] // Anchor point of the icon
        });

        // Loop through each buoy data and add a marker for each
        buoyInfo.forEach(buoy => {
            const { ID, name, lat, lon, href } = buoy;
            const buoyMarker = L.marker([lat, lon], {icon: buoyIcon}).addTo(map);
            buoyMarker.bindPopup(`<b>${name}</b><br><a href="${href}" target="_blank">More info</a>`);
            buoyMarkers.push(buoyMarker);
        });
        
        // Fetch and parse data
        //fetchCampaignData()

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
        color: rgb(231, 214, 166);
    }

    img {
        display: block;
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

    <p class="mt-5 mb-20">
        <img src="https://cdn-icons-png.flaticon.com/512/1816/1816116.png" alt="Buoy" width="128"/>
    </p>

    <h3>
        🚧 Work in progress! 🚧
    </h3> 

    <p class="size-l">
        A Windy plugin that "should" displays data from French wave buoys operated by Cerema.
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

    <hr />
    
    <p class="mt-20 mb-5">
        <img src="https://urbanvitaliz.fr/static/img/partners/logo_cerema.png" alt="Cerema" width="256"/>
    </p>

</section>