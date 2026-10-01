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
                minimumFractionDigits: 0,
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

            wrapper.className =
                'calc-subsection window-type';

            wrapper.dataset.windowType =
                String(i);


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

            wrapper.className =
                'calc-subsection door-type';

            wrapper.dataset.doorType =
                String(i);


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

        const count =
            number(windowsCount?.value);


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

        const count =
            number(doorsCount?.value);


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
        document.getElementById(
            'PFD_col_frontonov'
        );


    function updateGablesVisibility() {

        const count =
            number(gableCount?.value);


        const gable1 =
            document.getElementById(
                'additionalGable1'
            );

        const gable2 =
            document.getElementById(
                'additionalGable2'
            );


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

       Preserves the original Tilda behavior,
       including the duplicated type 4.
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
                Original Tilda formula contains
                PO4 twice.
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

    function calculateTotalBlocks(
        totalWallArea
    ) {

        return totalWallArea * 12.5;
    }


    function calculateBlockVolume(
        totalBlocks
    ) {

        return totalBlocks / 33;
    }


    function calculateOuterCornerBlocks() {

        return (
            getValue('PSDF_visota') /
            0.2
        ) * getValue('PSDF_ugol_naruzh');
    }


    function calculateOuterCornerPrice(
        quantity
    ) {

        return quantity * 400;
    }


    function calculateInnerCornerBlocks() {

        return (
            getValue('PSDF_visota') /
            0.2
        ) * getValue('PSDF_ugol_vnut');
    }


    function calculateInnerCornerPrice(
        quantity
    ) {

        return quantity * 350;
    }


    function calculateInternalAdditionalBlocks(
        innerCorners
    ) {

        return innerCorners;
    }


    function calculateInternalAdditionalPrice(
        quantity
    ) {

        return quantity * 120;
    }


    function calculateDoorBlocks() {

        let total = 0;


        for (let i = 1; i <= 4; i++) {

            total +=
                getValue(`PDD_visota${i}`) *
                getValue(`PDD_col${i}`);

        }


        return total / 0.2;
    }


    function calculateDoorBlockPrice(
        quantity
    ) {

        return quantity * 350;
    }


    /*
        These two categories existed in the
        original formula but have no source
        fields in the calculator.
    */

    const doorBlock12 = 0;
    const doorBlock12Price = 0;


    function calculateWindowBlocks() {

        let total = 0;


        for (let i = 1; i <= 9; i++) {

            total +=
                getValue(`PO_visota${i}`) *
                getValue(`PO_col${i}`);

        }


        return total / 0.2;
    }


    function calculateWindowBlockPrice(
        quantity
    ) {

        return quantity * 350;
    }


    const windowBlock12 = 0;
    const windowBlock12Price = 0;


    /* =========================================================
       ARMOPoyAS BLOCKS
    ========================================================= */

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


    function calculateArmopoyasPrice(
        quantity
    ) {

        return quantity * 200;
    }


    /* =========================================================
       ROW BLOCKS
    ========================================================= */

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


    function calculateRowBlockPrice(
        quantity
    ) {

        return quantity * 345;
    }


    /* =========================================================
       PALLETS / PACKAGING
    ========================================================= */

    function calculatePackaging(
        totalWallArea
    ) {

        return (
            totalWallArea *
            12.5
        ) / 36;
    }


    function calculatePackagingPrice(
        quantity
    ) {

        return quantity * 400;
    }


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
            Final wall area:

            Main walls
            +
            Gables
            -
            Windows
            -
            Doors
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


        /* ---------------------------------------------
           COSTS
        --------------------------------------------- */

        /*
            COST OF BLOCKS

            IMPORTANT:
            Packaging is NOT included here anymore.

            The original formula contained
            outerCornerPrice twice.
            This is preserved exactly.
        */

        const blocksCost =

            outerCornerPrice +

            outerCornerPrice +

            internalAdditionalPrice +

            doorBlockPrice +

            doorBlock12Price +

            windowBlockPrice +

            windowBlock12Price +

            armopoyasPrice +

            rowBlockPrice;


        /*
            PACKAGING

            Packaging and pallets are calculated separately.
        */

        const materialsPackagingCost =
            packagingPrice;


        /*
            TOTAL MATERIALS COST

            Blocks + packaging.

            This value is kept in the original
            hidden field "Itogo_stoimost".
        */

        const materialsCost =
            blocksCost +
            materialsPackagingCost;


        /* ---------------------------------------------
           HOUSE CONSTRUCTION COST
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

           DELIVERY REMOVED.

           The existing calculator logic defines
           the final total as the construction cost.
        --------------------------------------------- */

        const finalTotal =
            constructionCost;


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


        /*
            Original hidden field:
            total cost of blocks + packaging.
        */

        setValue(
            'Itogo_stoimost',
            materialsCost
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

           DELIVERY REMOVED
        --------------------------------------------- */

        setValue(
            'Formula',
            'PSDF_dlina*PSDF_shirina*Tip_doma'
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


        /* ---------------------------------------------
           THREE SEPARATE COSTS
        --------------------------------------------- */

        /*
            1. COST OF BLOCKS
        */

        setMoneyView(
            'blocksCostView',
            blocksCost
        );


        /*
            2. PACKAGING AND PALLETS
        */

        setMoneyView(
            'packagingCostView',
            materialsPackagingCost
        );


        /*
            3. CONSTRUCTION COST
        */

        setMoneyView(
            'constructionCostView',
            constructionCost
        );


        /*
            FINAL TOTAL
        */

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
                Round the same values that the original
                calculator rounded before submission.
            */

            const roundedPackaging =
                Math.ceil(
                    getValue(
                        'Poddoni_i_upakovka'
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
                'Blok_ryadniy',
                roundedRowBlocks
            );


            /*
                DELIVERY HAS BEEN REMOVED.

                No Yandex Maps.
                No address.
                No distance.
                No trucks.
                No delivery cost.
            */


            const construction =
                getValue(
                    'Obshaya_stoimost_stroitelstva'
                );


            const final =
                construction;


            setValue(
                'ITOGO',
                final
            );


            setMoneyView(
                'constructionCostView',
                construction
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