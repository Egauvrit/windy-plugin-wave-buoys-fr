<script lang="ts">
    import config from "src/pluginConfig";

</script>

<div class="footer">
    <p class="main">
        Wave Buoys (FR) Plugin made by <a href="https://github.com/Egauvrit" target="_blank">Egauvrit</a>
    </p>
    <p class="links">
        <a href="https://github.com/Egauvrit/windy-plugin-wave-buoys-fr" target="_blank">Source</a>
        <a href="https://github.com/Egauvrit/windy-plugin-wave-buoys-fr/issues" target="_blank">Issues</a>
    </p>
    <p class="fineprint">windy-plugin-wave-buoys-fr@{config.version}</p>
</div>

<style lang="less">
    .footer{
        margin-top: 2rem;
        margin-left: auto;
        margin-right: auto;
        background-color: rgb(49, 49, 49);
        border: 0.05rem solid rgb(126, 126, 126);
        border-radius: 0.8rem;
        padding: 0.3rem 1rem;
        display: flex;
        gap: 0.3rem;
        flex-direction: column;
        align-items: center;
        width: 80%;

        * {
            user-select: text;
        }

        p {
            padding: 0;
            margin: 0;
        }

        a span, a{
            text-decoration: underline;
        }

        .support {
            color: rgb(226, 217, 174);
            text-decoration: none;
        }

        .links{
            display: flex;
            gap: 0.3rem;
            flex-wrap: wrap;
            row-gap: 0;


            a {
                padding: 0 0.3rem;
                white-space: nowrap;
            }
        }

        .fineprint{
            color: rgb(226, 217, 174);
            font-size: 10px;
        }
    }
</style>