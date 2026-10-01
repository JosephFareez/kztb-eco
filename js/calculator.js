(() => {

    'use strict';


    /* =========================================================
       BASIC HELPERS
    ========================================================= */

    const form = document.getElementById('ecoCalculator');

    if (!form) {
        return;
    }


    const $ = (selector, root = form) => {
        return root.querySelector(selector);
    };


    const $$ = (selector, root = form) => {
        return [...root.querySelectorAll(selector)];
    };


    function number(value) {

        if (value === null || value === undefined) {
            return 0;
        }

        const normalized = String(value)
            .replace(/\s/g, '')
            .replace(',', '.');

        const result = parseFloat(normalized);

        return Number.isFinite(result) ? result : 0;
    }


    function getValue(name) {

        const field = form.querySelector(`[name="${name}"]`);

        return field ? number(field.value) : 0;
    }


    function setValue(name, value) {

        const field = form.querySelector(`[name="${name}"]`);

        if (!field) {
            return;
        }

        field.value = value;
    }


    function setView(id, value, decimals = 2) {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        const rounded = Number(value) || 0;

        element.textContent = rounded.toLocaleString(
            'ru-RU',
            {
                minimumFractionDigits: decimals > 0 ? 0 : 0,
                maximumFractionDigits: decimals
            }
        );
    }


    function money(value) {

        return Math.round(Number(value) || 0)
            .toLocaleString('ru-RU');
    }


    function setMoneyView(id, value) {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.textContent = money(value);
    }


    /* =========================================================
       DYNAMIC WINDOWS
       Original Tilda calculator supports 9 window types.
    ========================================================= */

    const windowsContainer =
        document.getElementById('windowsContainer');


    function createWindows() {

        if (!windowsContainer) {
            return;
        }

        windowsContainer.innerHTML = '';


        for (let i = 1; i <= 9; i++) {

            const wrapper =
                document.createElement('div');

            wrapper.className = 'calc-subsection window-type';

            wrapper.dataset.windowType = String(i);


            wrapper.innerHTML = `

                <h4>
                    Окно ${i}
                </h4>

                <div class="calc-grid">

                    <div class="calc-field">

                        <label for="PO_shirina${i}">
                            Ширина, м
                        </label>

                        <input
                            type="number"
                            id="PO_shirina${i}"
                            name="PO_shirina${i}"
                            value="0"
                            min="0"
                            step="0.01"
                        >

                    </div>


                    <div class="calc-field">

                        <label for="PO_visota${i}">
                            Высота, м
                        </label>

                        <input
                            type="number"
                            id="PO_visota${i}"
                            name="PO_visota${i}"
                            value="0"
                            min="0"
                            step="0.01"
                        >

                    </div>


                    <div class="calc-field">

                        <label for="PO_col${i}">
                            Количество
                        </label>

                        <input
                            type="number"
                            id="PO_col${i}"
                            name="PO_col${i}"
                            value="0"
                            min="0"
                            step="1"
                        >

                    </div>

                </div>
            `;


            windowsContainer.appendChild(wrapper);
        }
    }


    createWindows();


    /* =========================================================
       DYNAMIC DOORS
       Original Tilda calculator supports 4 door types.
    ========================================================= */

    const doorsContainer =
        document.getElementById('doorsContainer');


    function createDoors() {

        if (!doorsContainer) {
            return;
        }

        doorsContainer.innerHTML = '';


        for (let i = 1; i <= 4; i++) {

            const wrapper =
                document.createElement('div');

            wrapper.className = 'calc-subsection door-type';

            wrapper.dataset.doorType = String(i);


            wrapper.innerHTML = `

                <h4>
                    Дверь ${i}
                </h4>

                <div class="calc-grid">

                    <div class="calc-field">

                        <label for="PDD_shirina${i}">
                            Ширина, м
                        </label>

                        <input
                            type="number"
                            id="PDD_shirina${i}"
                            name="PDD_shirina${i}"
                            value="0"
                            min="0"
                            step="0.01"
                        >

                    </div>


                    <div class="calc-field">

                        <label for="PDD_visota${i}">
                            Высота, м
                        </label>

                        <input
                            type="number"
                            id="PDD_visota${i}"
                            name="PDD_visota${i}"
                            value="0"
                            min="0"
                            step="0.01"
                        >

                    </div>


                    <div class="calc-field">

                        <label for="PDD_col${i}">
                            Количество
                        </label>

                        <input
                            type="number"
                            id="PDD_col${i}"
                            name="PDD_col${i}"
                            value="0"
                            min="0"
                            step="1"
                        >

                    </div>

                </div>
            `;


            doorsContainer.appendChild(wrapper);
        }
    }


    createDoors();


    /* =========================================================
       CONDITIONAL WINDOWS
    ========================================================= */

    const windowsCount =
        document.getElementById('PO_col');


    function updateWindowsVisibility() {

        const count = number(
            windowsCount?.value
        );


        $$('.window-type').forEach((element, index) => {

            const visible =
                index < count;

            element.style.display =
                visible ? '' : 'none';


            if (!visible) {

                $$('input', element).forEach(input => {
                    input.value = '0';
                });

            }

        });
    }


    windowsCount?.addEventListener(
        'change',
        () => {

            updateWindowsVisibility();
            calculate();

        }
    );


    /* =========================================================
       CONDITIONAL DOORS
    ========================================================= */

    const doorsCount =
        document.getElementById('PDD');


    function updateDoorsVisibility() {

        const count = number(
            doorsCount?.value
        );


        $$('.door-type').forEach((element, index) => {

            const visible =
                index < count;

            element.style.display =
                visible ? '' : 'none';


            if (!visible) {

                $$('input', element).forEach(input => {
                    input.value = '0';
                });

            }

        });
    }


    doorsCount?.addEventListener(
        'change',
        () => {

            updateDoorsVisibility();
            calculate();

        }
    );


    /* =========================================================
       CONDITIONAL GABLES
    ========================================================= */

    const gableCount =
        document.getElementById('PFD_col_frontonov');


    function updateGablesVisibility() {

        const count = number(
            gableCount?.value
        );


        const gable1 =
            document.getElementById('additionalGable1');

        const gable2 =
            document.getElementById('additionalGable2');


        if (gable1) {

            gable1.style.display =
                count >= 2 ? '' : 'none';


            if (count < 2) {

                $$('input', gable1).forEach(input => {
                    input.value = '0';
                });

            }
        }


        if (gable2) {

            gable2.style.display =
                count >= 3 ? '' : 'none';


            if (count < 3) {

                $$('input', gable2).forEach(input => {
                    input.value = '0';
                });

            }
        }
    }


    gableCount?.addEventListener(
        'change',
        () => {

            updateGablesVisibility();
            calculate();

        }
    );


    /* =========================================================
       MAIN WALL AREA

       ORIGINAL TILDA:

       ((PSDF_dlina*2)+(PSDF_shirina*2))*PSDF_visota
    ========================================================= */

    function calculateMainWallArea() {

        const length =
            getValue('PSDF_dlina');

        const width =
            getValue('PSDF_shirina');

        const height =
            getValue('PSDF_visota');


        return (
            (length * 2) +
            (width * 2)
        ) * height;
    }


    /* =========================================================
       GABLE AREA

       ORIGINAL:

       (PFD_dlina*PFD_shirina)
       +
       (PFD_dlina_dop1*PFD_shirina_dop1*0.5)
       +
       (PFD_dlina_dop2*PFD_shirina_dop2*0.5)
    ========================================================= */

    function calculateGableArea() {

        const mainLength =
            getValue('PFD_dlina');

        const mainHeight =
            getValue('PFD_shirina');

        const additional1 =
            getValue('PFD_dlina_dop1') *
            getValue('PFD_shirina_dop1') *
            0.5;

        const additional2 =
            getValue('PFD_dlina_dop2') *
            getValue('PFD_shirina_dop2') *
            0.5;


        return (
            mainLength * mainHeight
        ) + additional1 + additional2;
    }


    /* =========================================================
       WINDOWS AREA

       IMPORTANT:

       The original Tilda formula contains PO #4 twice.

       We intentionally preserve it here.

       Original:

       PO1
       + PO2
       + PO3
       + PO4
       + PO4
       + PO5
       ...
       + PO9
    ========================================================= */

    function calculateWindowArea() {

        let total = 0;


        for (let i = 1; i <= 9; i++) {

            const width =
                getValue(`PO_shirina${i}`);

            const height =
                getValue(`PO_visota${i}`);

            const count =
                getValue(`PO_col${i}`);


            total +=
                width *
                height *
                count;


            /*
                Preserve the duplicate PO4
                from the original Tilda formula.
            */

            if (i === 4) {

                total +=
                    width *
                    height *
                    count;

            }

        }


        return total;
    }


    /* =========================================================
       DOORS AREA

       ORIGINAL:

       (width * height * count)
       for doors 1-4
    ========================================================= */

    function calculateDoorArea() {

        let total = 0;


        for (let i = 1; i <= 4; i++) {

            const width =
                getValue(`PDD_shirina${i}`);

            const height =
                getValue(`PDD_visota${i}`);

            const count =
                getValue(`PDD_col${i}`);


            total +=
                width *
                height *
                count;
        }


        return total;
    }


    /* =========================================================
       PDD_CH

       ORIGINAL:

       PDD_shirina1*PDD_col1
       +
       PDD_shirina2*PDD_col2
       +
       PDD_shirina3*PDD_col3
       +
       PDD_shirina4*PDD_col4
    ========================================================= */

    function calculatePDD_CH() {

        let total = 0;


        for (let i = 1; i <= 4; i++) {

            total +=
                getValue(`PDD_shirina${i}`) *
                getValue(`PDD_col${i}`);

        }


        return total;
    }


    /* =========================================================
       PO_CH

       ORIGINAL:

       PO_shirina1*PO_col1
       ...
       PO_shirina9*PO_col9
    ========================================================= */

    function calculatePO_CH() {

        let total = 0;


        for (let i = 1; i <= 9; i++) {

            total +=
                getValue(`PO_shirina${i}`) *
                getValue(`PO_col${i}`);

        }


        return total;
    }


    /* =========================================================
       BLOCK CALCULATIONS
    ========================================================= */


    /*
        Total blocks

        ORIGINAL:

        PZVOD_total * 12.5
    */

    function calculateTotalBlocks(
        totalWallArea
    ) {

        return totalWallArea * 12.5;
    }


    /*
        Block volume

        ORIGINAL:

        Itogo_kolichestvo_blokov / 33
    */

    function calculateBlockVolume(
        totalBlocks
    ) {

        return totalBlocks / 33;
    }


    /*
        Outer corner blocks

        ORIGINAL:

        PSDF_visota / 0.2 * PSDF_ugol_naruzh
    */

    function calculateOuterCornerBlocks() {

        return (
                getValue('PSDF_visota') /
                0.2
            ) *
            getValue('PSDF_ugol_naruzh');
    }


    /*
        Outer corner price

        ORIGINAL:

        quantity * 400
    */

    function calculateOuterCornerPrice(
        quantity
    ) {

        return quantity * 400;
    }


    /*
        Inner corner blocks

        ORIGINAL:

        PSDF_visota / 0.2 * PSDF_ugol_vnut
    */

    function calculateInnerCornerBlocks() {

        return (
                getValue('PSDF_visota') /
                0.2
            ) *
            getValue('PSDF_ugol_vnut');
    }


    /*
        Inner corner price

        ORIGINAL:

        quantity * 350
    */

    function calculateInnerCornerPrice(
        quantity
    ) {

        return quantity * 350;
    }


    /*
        Internal additional blocks

        ORIGINAL:

        Blok_uglovoy_vnut
    */

    function calculateInternalAdditionalBlocks(
        innerCorners
    ) {

        return innerCorners;
    }


    /*
        Internal additional blocks price

        ORIGINAL:

        quantity * 120
    */

    function calculateInternalAdditionalPrice(
        quantity
    ) {

        return quantity * 120;
    }


    /*
        Door blocks

        ORIGINAL:

        (
            PDD_visota1 * PDD_col1
            +
            ...
        ) / 0.2
    */

    function calculateDoorBlocks() {

        let total = 0;


        for (let i = 1; i <= 4; i++) {

            total +=
                getValue(`PDD_visota${i}`) *
                getValue(`PDD_col${i}`);

        }


        return total / 0.2;
    }


    /*
        Door block price

        ORIGINAL:

        quantity * 350
    */

    function calculateDoorBlockPrice(
        quantity
    ) {

        return quantity * 350;
    }


    /*
        Second door block category

        The original final formula references
        Blok_dvernogo_proema_12, but the uploaded
        calculator does not define that field.

        Therefore it effectively remains 0.
    */

    const doorBlock12 = 0;

    const doorBlock12Price = 0;


    /*
        Window blocks

        ORIGINAL:

        (
            PO_visota1 * PO_col1
            +
            ...
            PO_visota9 * PO_col9
        ) / 0.2
    */

    function calculateWindowBlocks() {

        let total = 0;


        for (let i = 1; i <= 9; i++) {

            total +=
                getValue(`PO_visota${i}`) *
                getValue(`PO_col${i}`);

        }


        return total / 0.2;
    }


    /*
        Window block price

        ORIGINAL:

        quantity * 350
    */

    function calculateWindowBlockPrice(
        quantity
    ) {

        return quantity * 350;
    }


    /*
        Second window block category.

        Referenced by the original formula,
        but not defined as an input/calculation
        in the uploaded Tilda source.

        Therefore 0.
    */

    const windowBlock12 = 0;

    const windowBlock12Price = 0;


    /*
        Armopoyas blocks

        ORIGINAL:

        ((PSDF_dlina*PSDF_shirina)
        * PSDF_kol_armopoyasov / 0.4)

        +

        (
            (PO_CH + PDD_CH) / 0.4
            +
            (
                PDD_col1
                + PDD_col2
                + PDD_col3
                + PDD_col4
                + PO_col1
                ...
                + PO_col9
            ) * 0.9
        )
    */

    function calculateArmopoyasBlocks(
        poCH,
        pddCH
    ) {

        const length =
            getValue('PSDF_dlina');

        const width =
            getValue('PSDF_shirina');

        const armopoyasCount =
            getValue('PSDF_kol_armopoyasov');


        let openingCounts = 0;


        for (let i = 1; i <= 4; i++) {

            openingCounts +=
                getValue(`PDD_col${i}`);

        }


        for (let i = 1; i <= 9; i++) {

            openingCounts +=
                getValue(`PO_col${i}`);

        }


        return (

            (
                length *
                width *
                armopoyasCount
            ) / 0.4

        ) + (

            (
                poCH +
                pddCH
            ) / 0.4

            +

            openingCounts * 0.9

        );
    }


    /*
        Armopoyas price

        ORIGINAL:

        quantity * 200
    */

    function calculateArmopoyasPrice(
        quantity
    ) {

        return quantity * 200;
    }


    /*
        Row blocks

        ORIGINAL:

        (Itogo_kolichestvo_blokov * 1.02)
        -
        (Blok_uglovoy_naruzhniy * 1.5)
        -
        (Blok_uglovoy_vnut * 0.5)
        -
        Blok_dvernogo_proema
        -
        (Blok_dvernogo_proema_12 / 2)
        -
        Blok_okonniy_chetvert
        -
        (Blok_okonniy_chetvert_12 / 2)
        -
        Blok_doborniy_armopoyasnoy
    */

    function calculateRowBlocks(
        totalBlocks,
        outerCorners,
        innerCorners,
        doorBlocks,
        windowBlocks,
        armopoyasBlocks
    ) {

        return (

            totalBlocks * 1.02

        ) - (

            outerCorners * 1.5

        ) - (

            innerCorners * 0.5

        ) - (

            doorBlocks

        ) - (

            doorBlock12 / 2

        ) - (

            windowBlocks

        ) - (

            windowBlock12 / 2

        ) - (

            armopoyasBlocks

        );
    }


    /*
        Row block price

        ORIGINAL:

        quantity * 345
    */

    function calculateRowBlockPrice(
        quantity
    ) {

        return quantity * 345;
    }


    /*
        Pallets / packaging

        ORIGINAL:

        PZVOD_total * 12.5 / 36
    */

    function calculatePackaging(
        totalWallArea
    ) {

        return (
            totalWallArea *
            12.5
        ) / 36;
    }


    /*
        Packaging price

        ORIGINAL:

        quantity * 400
    */

    function calculatePackagingPrice(
        quantity
    ) {

        return quantity * 400;
    }


    /*
        Trucks

        ORIGINAL:

        Poddoni_i_upakovka / 18
    */

    function calculateTrucks(
        packaging
    ) {

        return packaging / 18;
    }


    /* =========================================================
       DELIVERY
    ========================================================= */

    /*
        Original source address:

        Россия,
        Барятинский район,
        деревня Дегонка
    */

    const FROM_ADDRESS =
        'Россия, Барятинский район, деревня Дегонка';


    let deliveryDistance = 0;


    let yandexReadyPromise = null;


    /*
        Load Yandex Maps API dynamically.
    */

    function loadYandexMaps() {

        if (window.ymaps) {
            return Promise.resolve(window.ymaps);
        }


        if (yandexReadyPromise) {
            return yandexReadyPromise;
        }


        const apiKey =
            window.ECOBLOCK_YANDEX_API_KEY;


        if (
            !apiKey ||
            apiKey === 'YOUR_YANDEX_API_KEY'
        ) {

            console.warn(
                'Yandex Maps API key is not configured.'
            );

            return Promise.reject(
                new Error(
                    'Yandex Maps API key is not configured.'
                )
            );
        }


        yandexReadyPromise =
            new Promise((resolve, reject) => {

                const script =
                    document.createElement('script');


                script.src =
                    `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;


                script.async = true;


                script.onload = () => {

                    if (!window.ymaps) {

                        reject(
                            new Error(
                                'Yandex Maps API loaded incorrectly.'
                            )
                        );

                        return;
                    }


                    window.ymaps.ready(() => {
                        resolve(window.ymaps);
                    });

                };


                script.onerror = () => {

                    reject(
                        new Error(
                            'Could not load Yandex Maps API.'
                        )
                    );

                };


                document.head.appendChild(script);

            });


        return yandexReadyPromise;
    }


    /*
        Calculate road distance using Yandex Maps.

        This follows the same structure as the
        original Tilda script:

        geocode production address
        +
        geocode delivery address
        ->
        ymaps.route()
        ->
        distance in km
    */

    async function calculateDeliveryDistance(
        address
    ) {

        const status =
            document.getElementById(
                'deliveryStatus'
            );


        if (!address.trim()) {

            deliveryDistance = 0;

            setValue(
                'rasstoyanie_kilometr',
                0
            );

            if (status) {

                status.textContent =
                    'Введите адрес доставки';

            }

            calculate();

            return;
        }


        if (status) {

            status.textContent =
                'Определяем расстояние...';

        }


        try {

            const ymaps =
                await loadYandexMaps();


            const fromResult =
                await ymaps.geocode(
                    FROM_ADDRESS
                );


            const toResult =
                await ymaps.geocode(
                    address
                );


            const fromObject =
                fromResult.geoObjects.get(0);

            const toObject =
                toResult.geoObjects.get(0);


            if (!fromObject) {

                throw new Error(
                    'Не удалось определить адрес производства.'
                );
            }


            if (!toObject) {

                throw new Error(
                    'Не удалось определить адрес доставки.'
                );
            }


            const fromCoords =
                fromObject.geometry.getCoordinates();


            const toCoords =
                toObject.geometry.getCoordinates();


            const route =
                await ymaps.route(
                    [
                        fromCoords,
                        toCoords
                    ]
                );


            /*
                Original Tilda:

                Math.ceil(
                    route.getLength() / 1000
                )
            */

            deliveryDistance =
                Math.ceil(
                    route.getLength() / 1000
                );


            setValue(
                'rasstoyanie_kilometr',
                deliveryDistance
            );


            if (status) {

                status.textContent =
                    'Расстояние рассчитано';

            }


            calculate();

        } catch (error) {

            console.error(
                'Yandex Maps error:',
                error
            );


            deliveryDistance = 0;


            setValue(
                'rasstoyanie_kilometr',
                0
            );


            if (status) {

                status.textContent =
                    'Не удалось определить расстояние. Проверьте адрес.';

            }


            calculate();

        }

    }


    /* =========================================================
       DELIVERY INPUT
    ========================================================= */

    const addressInput =
        document.getElementById(
            'adress_dostavki'
        );


    let addressTimer = null;


    function requestDeliveryCalculation() {

        clearTimeout(addressTimer);


        addressTimer =
            setTimeout(() => {

                calculateDeliveryDistance(
                    addressInput?.value || ''
                );

            }, 500);
    }


    addressInput?.addEventListener(
        'change',
        requestDeliveryCalculation
    );


    addressInput?.addEventListener(
        'blur',
        requestDeliveryCalculation
    );


    /*
        We also listen to input so changing the address
        can update the route without requiring another
        click.
    */

    addressInput?.addEventListener(
        'input',
        requestDeliveryCalculation
    );


    /* =========================================================
       MAIN CALCULATION
    ========================================================= */

    function calculate() {

        /* ---------------------------------------------
           MAIN AREAS
        --------------------------------------------- */

        const mainWallArea =
            calculateMainWallArea();


        const gableArea =
            calculateGableArea();


        const windowArea =
            calculateWindowArea();


        const doorArea =
            calculateDoorArea();


        /*
            Original:

            PSDF_ploshad
            +
            PFD_ploshad
            -
            PO_ploshad_total
            -
            PDD_ploshad_total
        */

        const totalWallArea =
            mainWallArea +
            gableArea -
            windowArea -
            doorArea;


        /* ---------------------------------------------
           OPENING AUXILIARY VALUES
        --------------------------------------------- */

        const pddCH =
            calculatePDD_CH();


        const poCH =
            calculatePO_CH();


        /* ---------------------------------------------
           BLOCK QUANTITIES
        --------------------------------------------- */

        const totalBlocks =
            calculateTotalBlocks(
                totalWallArea
            );


        const blockVolume =
            calculateBlockVolume(
                totalBlocks
            );


        const outerCorners =
            calculateOuterCornerBlocks();


        const outerCornerPrice =
            calculateOuterCornerPrice(
                outerCorners
            );


        const innerCorners =
            calculateInnerCornerBlocks();


        const innerCornerPrice =
            calculateInnerCornerPrice(
                innerCorners
            );


        const internalAdditional =
            calculateInternalAdditionalBlocks(
                innerCorners
            );


        const internalAdditionalPrice =
            calculateInternalAdditionalPrice(
                internalAdditional
            );


        const doorBlocks =
            calculateDoorBlocks();


        const doorBlockPrice =
            calculateDoorBlockPrice(
                doorBlocks
            );


        const windowBlocks =
            calculateWindowBlocks();


        const windowBlockPrice =
            calculateWindowBlockPrice(
                windowBlocks
            );


        const armopoyasBlocks =
            calculateArmopoyasBlocks(
                poCH,
                pddCH
            );


        const armopoyasPrice =
            calculateArmopoyasPrice(
                armopoyasBlocks
            );


        const rowBlocks =
            calculateRowBlocks(
                totalBlocks,
                outerCorners,
                innerCorners,
                doorBlocks,
                windowBlocks,
                armopoyasBlocks
            );


        const rowBlockPrice =
            calculateRowBlockPrice(
                rowBlocks
            );


        /* ---------------------------------------------
           PALLETS / PACKAGING
        --------------------------------------------- */

        const packaging =
            calculatePackaging(
                totalWallArea
            );


        const packagingPrice =
            calculatePackagingPrice(
                packaging
            );


        /*
            Original:

            Dostavka_fura =
            Poddoni_i_upakovka / 18
        */

        const trucks =
            calculateTrucks(
                packaging
            );


        /* ---------------------------------------------
           DELIVERY COST
        --------------------------------------------- */

        /*
            Original:

            rasstoyanie_kilometr
            *
            Dostavka_fura
            *
            125
        */

        const deliveryCost =
            deliveryDistance *
            trucks *
            125;


        /* ---------------------------------------------
           BLOCK TOTAL

           We preserve the original expression.

           Notice that the original has the
           outer corner price TWICE.
        --------------------------------------------- */

        const blockTotalCost =

            outerCornerPrice +

            outerCornerPrice +

            internalAdditionalPrice +

            doorBlockPrice +

            doorBlock12Price +

            windowBlockPrice +

            windowBlock12Price +

            armopoyasPrice +

            rowBlockPrice +

            packagingPrice;


        /* ---------------------------------------------
           HOUSE CONSTRUCTION COST

           Original:

           Tip_doma *
           PSDF_dlina *
           PSDF_shirina
        --------------------------------------------- */

        const houseTypePrice =
            getValue('Tip_doma');


        const length =
            getValue('PSDF_dlina');


        const width =
            getValue('PSDF_shirina');


        const constructionCost =
            houseTypePrice *
            length *
            width;


        /* ---------------------------------------------
           FINAL TOTAL

           Original:

           PSDF_dlina *
           PSDF_shirina *
           Tip_doma
           +
           Stoimost_dostavki
        --------------------------------------------- */

        const finalTotal =
            constructionCost +
            deliveryCost;


        /* ---------------------------------------------
           UPDATE HIDDEN FIELDS
        --------------------------------------------- */

        setValue(
            'PSDF_ploshad',
            mainWallArea
        );


        setValue(
            'PFD_ploshad',
            gableArea
        );


        setValue(
            'PO_ploshad_total',
            windowArea
        );


        setValue(
            'PDD_ploshad_total',
            doorArea
        );


        setValue(
            'PZVOD_total',
            totalWallArea
        );


        setValue(
            'Itogo_kolichestvo_blokov',
            totalBlocks
        );


        setValue(
            'Obiem_blokov',
            blockVolume
        );


        setValue(
            'Blok_uglovoy_naruzhniy',
            outerCorners
        );


        setValue(
            'Blok_uglovoy_naruzhniy_cena',
            outerCornerPrice
        );


        setValue(
            'Blok_uglovoy_vnut',
            innerCorners
        );


        setValue(
            'Blok_uglovoy_vnut_cena',
            innerCornerPrice
        );


        setValue(
            'Blok_doborniy_vnut',
            internalAdditional
        );


        setValue(
            'Blok_doborniy_vnut_cena',
            internalAdditionalPrice
        );


        setValue(
            'Blok_dvernogo_proema',
            doorBlocks
        );


        setValue(
            'Blok_dvernogo_proema_cena',
            doorBlockPrice
        );


        setValue(
            'Blok_dvernogo_proema_12',
            doorBlock12
        );


        setValue(
            'Blok_dvernogo_proema_cena_12',
            doorBlock12Price
        );


        setValue(
            'Blok_okonniy_chetvert',
            windowBlocks
        );


        setValue(
            'Blok_okonniy_chetvert_cena',
            windowBlockPrice
        );


        setValue(
            'Blok_okonniy_chetvert_12',
            windowBlock12
        );


        setValue(
            'Blok_okonniy_chetvert_cena_12',
            windowBlock12Price
        );


        setValue(
            'PDD_CH',
            pddCH
        );


        setValue(
            'PO_CH',
            poCH
        );


        setValue(
            'Blok_doborniy_armopoyasnoy',
            armopoyasBlocks
        );


        setValue(
            'Blok_doborniy_armopoyasnoy_cena',
            armopoyasPrice
        );


        setValue(
            'Blok_ryadniy',
            rowBlocks
        );


        setValue(
            'Blok_ryadniy_cena',
            rowBlockPrice
        );


        setValue(
            'Poddoni_i_upakovka',
            packaging
        );


        setValue(
            'Poddoni_i_upakovka_cena',
            packagingPrice
        );


        setValue(
            'Dostavka_fura',
            trucks
        );


        setValue(
            'Stoimost_dostavki',
            deliveryCost
        );


        setValue(
            'Itogo_stoimost',
            blockTotalCost
        );


        setValue(
            'Obshaya_stoimost_stroitelstva',
            constructionCost
        );


        setValue(
            'ITOGO',
            finalTotal
        );


        /* ---------------------------------------------
           FORMULA FIELD
        --------------------------------------------- */

        setValue(
            'Formula',
            'PSDF_dlina*PSDF_shirina*Tip_doma+Stoimost_dostavki'
        );


        /* ---------------------------------------------
           UPDATE VISIBLE RESULTS
        --------------------------------------------- */

        setView(
            'PSDF_ploshad_view',
            mainWallArea,
            2
        );


        setView(
            'PFD_ploshad_view',
            gableArea,
            2
        );


        setView(
            'PO_ploshad_total_view',
            windowArea,
            2
        );


        setView(
            'PDD_ploshad_total_view',
            doorArea,
            2
        );


        setView(
            'PZVOD_total_view',
            totalWallArea,
            2
        );


        setView(
            'Itogo_kolichestvo_blokov_view',
            totalBlocks,
            0
        );


        setView(
            'Obiem_blokov_view',
            blockVolume,
            2
        );


        setView(
            'Blok_uglovoy_naruzhniy_view',
            outerCorners,
            0
        );


        setView(
            'Blok_uglovoy_vnut_view',
            innerCorners,
            0
        );


        setView(
            'Blok_dvernogo_proema_view',
            doorBlocks,
            0
        );


        setView(
            'Blok_okonniy_chetvert_view',
            windowBlocks,
            0
        );


        setView(
            'Blok_doborniy_armopoyasnoy_view',
            armopoyasBlocks,
            0
        );


        setView(
            'Blok_ryadniy_view',
            rowBlocks,
            0
        );


        setMoneyView(
            'Itogo_stoimost_view',
            blockTotalCost
        );


        setView(
            'distanceView',
            deliveryDistance,
            0
        );


        setView(
            'trucksView',
            trucks,
            2
        );


        setMoneyView(
            'deliveryCostView',
            deliveryCost
        );


        setMoneyView(
            'deliveryCostView2',
            deliveryCost
        );


        setMoneyView(
            'constructionCostView',
            constructionCost
        );


        setMoneyView(
            'ITOGO_view',
            finalTotal
        );
    }


    /* =========================================================
       INPUT LISTENERS
    ========================================================= */

    form.addEventListener(
        'input',
        event => {

            if (
                event.target.matches(
                    'input, select'
                )
            ) {

                calculate();

            }

        }
    );


    form.addEventListener(
        'change',
        event => {

            if (
                event.target.matches(
                    'input, select'
                )
            ) {

                calculate();

            }

        }
    );


    /* =========================================================
       FORM SUBMIT
    ========================================================= */

    form.addEventListener(
        'submit',
        event => {

            event.preventDefault();


            /*
                The original Tilda custom script rounded
                these fields before submission:

                Dostavka_fura
                Poddoni_i_upakovka
                Blok_ryadniy

                We reproduce that behavior here.
            */

            const roundedPackaging =
                Math.ceil(
                    getValue(
                        'Poddoni_i_upakovka'
                    )
                );


            const roundedTrucks =
                Math.ceil(
                    getValue(
                        'Dostavka_fura'
                    )
                );


            const roundedRowBlocks =
                Math.ceil(
                    getValue(
                        'Blok_ryadniy'
                    )
                );


            setValue(
                'Poddoni_i_upakovka',
                roundedPackaging
            );


            setValue(
                'Dostavka_fura',
                roundedTrucks
            );


            setValue(
                'Blok_ryadniy',
                roundedRowBlocks
            );


            /*
                Recalculate delivery using the rounded
                number of trucks, because the original
                submission process rounds Dostavka_fura.
            */

            const distance =
                getValue(
                    'rasstoyanie_kilometr'
                );


            const delivery =
                distance *
                roundedTrucks *
                125;


            setValue(
                'Stoimost_dostavki',
                delivery
            );


            const construction =
                getValue(
                    'Obshaya_stoimost_stroitelstva'
                );


            const final =
                construction +
                delivery;


            setValue(
                'ITOGO',
                final
            );


            setMoneyView(
                'deliveryCostView',
                delivery
            );


            setMoneyView(
                'deliveryCostView2',
                delivery
            );


            setMoneyView(
                'ITOGO_view',
                final
            );


            const message =
                document.getElementById(
                    'calculatorMessage'
                );


            if (message) {

                message.textContent =
                    'Расчёт сформирован.';

            }


            /*
                At this point the form contains all
                original calculation fields.

                This is where we can later connect:
                - email
                - PHP
                - Telegram bot
                - backend API
                - Tilda-compatible form endpoint
            */

            console.log(
                'ECOblock calculator data:',
                Object.fromEntries(
                    new FormData(form)
                )
            );

        }
    );


    /* =========================================================
       INITIAL STATE
    ========================================================= */

    updateWindowsVisibility();

    updateDoorsVisibility();

    updateGablesVisibility();

    calculate();

})();