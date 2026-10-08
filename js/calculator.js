(() => {
    'use strict';

    const form = document.getElementById('ecoCalculator');
    if (!form) return;

    const $ = (selector, root = form) => root.querySelector(selector);
    const $$ = (selector, root = form) => [...root.querySelectorAll(selector)];

    function number(value) {
        if (value === null || value === undefined) return 0;
        const normalized = String(value).replace(/\s/g, '').replace(',', '.');
        const result = parseFloat(normalized);
        return Number.isFinite(result) ? result : 0;
    }

    function getValue(name) {
        const field = form.querySelector(`[name="${name}"]`);
        return field ? number(field.value) : 0;
    }

    function setValue(name, value) {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) field.value = value;
    }

    function setView(id, value, decimals = 2) {
        const element = document.getElementById(id);
        if (element) {
            const rounded = Number(value) || 0;
            element.textContent = rounded.toLocaleString('ru-RU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimals
            });
        }
    }

    function setMoneyView(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = Math.round(Number(value) || 0).toLocaleString('ru-RU');
        }
    }

    /* =========================================================
       ОКНА И ДВЕРИ
    ========================================================= */
    function createWindows() {
        const container = document.getElementById('windowsContainer');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const w = document.createElement('div');
            w.className = 'calc-subsection window-type';
            w.innerHTML = `<h4>Окно ${i}</h4><div class="calc-grid">
                <div class="calc-field"><label>Ширина, м</label><input type="number" name="PO_shirina${i}" value="0" min="0" step="0.01"></div>
                <div class="calc-field"><label>Высота, м</label><input type="number" name="PO_visota${i}" value="0" min="0" step="0.01"></div>
                <div class="calc-field"><label>Количество</label><input type="number" name="PO_col${i}" value="0" min="0" step="1"></div>
            </div>`;
            container.appendChild(w);
        }
    }

    createWindows();

    function createDoors() {
        const container = document.getElementById('doorsContainer');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const d = document.createElement('div');
            d.className = 'calc-subsection door-type';
            d.innerHTML = `<h4>Дверь ${i}</h4><div class="calc-grid">
                <div class="calc-field"><label>Ширина, м</label><input type="number" name="PDD_shirina${i}" value="0" min="0" step="0.01"></div>
                <div class="calc-field"><label>Высота, м</label><input type="number" name="PDD_visota${i}" value="0" min="0" step="0.01"></div>
                <div class="calc-field"><label>Количество</label><input type="number" name="PDD_col${i}" value="0" min="0" step="1"></div>
            </div>`;
            container.appendChild(d);
        }
    }

    createDoors();

    function updateVisibility(countId, typeClass) {
        const count = number(document.getElementById(countId)?.value);
        $$(typeClass).forEach((el, index) => {
            const visible = index < count;
            el.style.display = visible ? '' : 'none';
            if (!visible) $$
            ('input', el).forEach(input => input.value = '0');
        });
    }

    /* =========================================================
       ЦЕНЫ И НАСТРОЙКИ (ИЗ EXCEL)
    ========================================================= */
    function getBlockConfig() {
        const type = document.getElementById('Block_type')?.value || '400';
        const config = {
            '300': {
                volumeDivisor: 43,
                palletCapacity: 48,
                prices: {
                    outerCorner: 400,
                    innerCorner: 500,
                    internalAdditional: 120,
                    finish: 320,
                    door: 320,
                    door12: 200,
                    window: 320,
                    window12: 200,
                    armopoyas: 200,
                    row: 298,
                    packaging: 400
                },
                materials: {mix: 3.9, foam: 1.6, mesh: 6.7} // Коэффициенты для 300мм
            },
            '400': {
                volumeDivisor: 33,
                palletCapacity: 36,
                prices: {
                    outerCorner: 400,
                    innerCorner: 420,
                    internalAdditional: 120,
                    finish: 345,
                    door: 335,
                    door12: 240,
                    window: 335,
                    window12: 220,
                    armopoyas: 260,
                    row: 325,
                    packaging: 400
                },
                materials: {mix: 3.9, foam: 1.93, mesh: 5.0} // Коэффициенты для 400мм
            }
        };
        return config[type];
    }

    /* =========================================================
       ПЛОЩАДИ И ПЕРИМЕТР
    ========================================================= */
    function calculateAreas() {
        const length = getValue('PSDF_dlina');
        const width = getValue('PSDF_shirina');
        const height = getValue('PSDF_visota');
        const perimeter = (length * 2) + (width * 2);
        const mainWallArea = perimeter * height;

        const gableArea = (getValue('PFD_dlina') * getValue('PFD_shirina')) +
            (getValue('PFD_dlina_dop1') * getValue('PFD_shirina_dop1') * 0.5) +
            (getValue('PFD_dlina_dop2') * getValue('PFD_shirina_dop2') * 0.5);

        let windowArea = 0;
        let poCH = 0;
        for (let i = 1; i <= 9; i++) {
            const wArea = getValue(`PO_shirina${i}`) * getValue(`PO_visota${i}`) * getValue(`PO_col${i}`);
            windowArea += wArea;
            if (i === 4) windowArea += wArea; // сохранение старой логики Tilda
            poCH += getValue(`PO_shirina${i}`) * getValue(`PO_col${i}`);
        }

        let doorArea = 0;
        let pddCH = 0;
        for (let i = 1; i <= 4; i++) {
            doorArea += getValue(`PDD_shirina${i}`) * getValue(`PDD_visota${i}`) * getValue(`PDD_col${i}`);
            pddCH += getValue(`PDD_shirina${i}`) * getValue(`PDD_col${i}`);
        }

        return {
            perimeter,
            mainWallArea,
            gableArea,
            windowArea,
            doorArea,
            poCH,
            pddCH,
            totalWallArea: mainWallArea + gableArea - windowArea - doorArea
        };
    }

    /* =========================================================
       ОСНОВНОЙ РАСЧЕТ
    ========================================================= */
    function calculate() {
        const cfg = getBlockConfig();
        const p = cfg.prices;
        const m = cfg.materials;
        const areas = calculateAreas();

        // 1. КОЛИЧЕСТВО БЛОКОВ
        const totalBlocks = Math.ceil(areas.totalWallArea * 12.5);
        const blockVolume = totalBlocks / cfg.volumeDivisor;

        const outerCorners = Math.ceil((getValue('PSDF_visota') / 0.2) * getValue('PSDF_ugol_naruzh'));
        const innerCorners = Math.ceil((getValue('PSDF_visota') / 0.2) * getValue('PSDF_ugol_vnut'));
        const internalAdditional = innerCorners;
        const finishBlocks = 0;

        let doorBlocksRaw = 0, openingCounts = 0;
        for (let i = 1; i <= 4; i++) {
            doorBlocksRaw += getValue(`PDD_visota${i}`) * getValue(`PDD_col${i}`);
            openingCounts += getValue(`PDD_col${i}`);
        }
        const doorBlocks = Math.ceil(doorBlocksRaw / 0.2);
        const doorBlock12 = doorBlocks;

        let windowBlocksRaw = 0;
        for (let i = 1; i <= 9; i++) {
            windowBlocksRaw += getValue(`PO_visota${i}`) * getValue(`PO_col${i}`);
            openingCounts += getValue(`PO_col${i}`);
        }
        const windowBlocks = Math.ceil(windowBlocksRaw / 0.2);
        const windowBlock12 = windowBlocks;

        const armopoyasBlocks = Math.ceil(((areas.perimeter * getValue('PSDF_kol_armopoyasov')) / 0.4) + ((areas.poCH + areas.pddCH) / 0.4 + openingCounts * 0.9));

        const rowBlocks = Math.ceil((totalBlocks * 1.02) - (outerCorners * 1.5) - (innerCorners * 0.5) - finishBlocks - doorBlocks - (doorBlock12 * 0.5) - windowBlocks - (windowBlock12 * 0.5) - armopoyasBlocks);

        const packaging = Math.ceil(totalBlocks / cfg.palletCapacity);

        // 2. СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ (Формулы из Excel)
        const mixCount = Math.ceil(blockVolume * m.mix);
        const foamCount = Math.ceil(blockVolume * m.foam);
        let meshCount = Math.round((blockVolume * m.mesh) / 50) * 50;
        if (meshCount === 0 && blockVolume > 0) meshCount = 50; // Минимум 1 рулон

        const hydroCount = Math.ceil(areas.perimeter / 37.5);
        const cleanerCount = Math.ceil(foamCount / 5);
        const gunCount = Math.ceil(blockVolume * 0.05);

        const mixCost = mixCount * 195;
        const foamCost = foamCount * 510;
        const meshCost = meshCount * 30;
        const hydroCost = hydroCount * 860;
        const cleanerCost = cleanerCount * 200;
        const gunCost = gunCount * 800;

        const totalMaterialsCost = mixCost + foamCost + meshCost + hydroCost + cleanerCost + gunCost;

        // 3. СТОИМОСТИ И ДОСТАВКА
        const blocksCost = (outerCorners * 2 * p.outerCorner) + (innerCorners * p.innerCorner) + (internalAdditional * p.internalAdditional) + (finishBlocks * p.finish) + (doorBlocks * p.door) + (doorBlock12 * p.door12) + (windowBlocks * p.window) + (windowBlock12 * p.window12) + (armopoyasBlocks * p.armopoyas) + (rowBlocks * p.row);
        const packagingPrice = packaging * p.packaging;
        const constructionCost = getValue('Tip_doma') * getValue('PSDF_dlina') * getValue('PSDF_shirina');

        const isDelivery = document.getElementById('Delivery_need')?.value === 'yes';
        const distance = getValue('Delivery_km');
        const trucksCount = Math.ceil(packaging / 20); // 1 фура везет до 20 паллет
        const deliveryCost = (isDelivery && distance > 0) ? trucksCount * distance * 150 : 0;

        if (document.getElementById('distanceFieldWrap')) {
            document.getElementById('distanceFieldWrap').style.display = isDelivery ? 'block' : 'none';
            document.getElementById('addressFieldWrap').style.display = isDelivery ? 'block' : 'none';
            document.getElementById('deliveryResultLine').style.display = isDelivery ? 'flex' : 'none';
            document.getElementById('deliveryTotalRow').style.display = isDelivery ? 'flex' : 'none';
        }

        const finalTotal = blocksCost + packagingPrice + totalMaterialsCost + constructionCost + deliveryCost;

        // ВЫВОД НА ЭКРАН (БЛОКИ И ПЛОЩАДИ)
        setView('PSDF_ploshad_view', areas.mainWallArea, 2);
        setView('PFD_ploshad_view', areas.gableArea, 2);
        setView('PO_ploshad_total_view', areas.windowArea, 2);
        setView('PDD_ploshad_total_view', areas.doorArea, 2);
        setView('PZVOD_total_view', areas.totalWallArea, 2);

        setView('Itogo_kolichestvo_blokov_view', totalBlocks, 0);
        setView('Obiem_blokov_view', blockVolume, 2);
        setView('Blok_uglovoy_naruzhniy_view', outerCorners, 0);
        setView('Blok_uglovoy_vnut_view', innerCorners, 0);
        setView('Blok_doborniy_vnut_view', internalAdditional, 0);
        setView('Blok_finishniy_view', finishBlocks, 0);
        setView('Blok_dvernogo_proema_view', doorBlocks, 0);
        setView('Blok_dvernogo_proema_12_view', doorBlock12, 0);
        setView('Blok_okonniy_chetvert_view', windowBlocks, 0);
        setView('Blok_okonniy_chetvert_12_view', windowBlock12, 0);
        setView('Blok_doborniy_armopoyasnoy_view', armopoyasBlocks, 0);
        setView('Blok_ryadniy_view', rowBlocks, 0);

        // ВЫВОД НА ЭКРАН (МАТЕРИАЛЫ)
        setView('mat_mix_view', mixCount, 0);
        setView('mat_foam_view', foamCount, 0);
        setView('mat_mesh_view', meshCount, 0);
        setView('mat_hydro_view', hydroCount, 0);
        setView('mat_cleaner_view', cleanerCount, 0);
        setView('mat_gun_view', gunCount, 0);

        // ВЫВОД НА ЭКРАН (ДЕНЬГИ)
        setMoneyView('blocksCostView', blocksCost);
        setView('palletsCountView', packaging, 0);
        setMoneyView('packagingCostView', packagingPrice);

        setMoneyView('materialsCostView', totalMaterialsCost);
        setMoneyView('finalConsumablesCostView', totalMaterialsCost);

        setView('trucksCountView', trucksCount, 0);
        setMoneyView('deliveryCostView', deliveryCost);
        setMoneyView('finalDeliveryCostView', deliveryCost);
        setMoneyView('constructionCostView', constructionCost);
        setMoneyView('ITOGO_view', finalTotal);

        // СКРЫТЫЕ ПОЛЯ ДЛЯ ПОЧТЫ (FORMSPREE)
        setValue('Площадь_стен_м2', areas.totalWallArea.toFixed(2));
        setValue('Итого_Блоков_шт', totalBlocks);
        setValue('Объем_Блоков_м3', blockVolume.toFixed(2));
        setValue('Количество_Поддонов', packaging);

        // Скрытые поля материалов (убедитесь, что они есть в HTML)
        setValue('Материалы_Смесь_М200_меш', mixCount);
        setValue('Материалы_Пена_шт', foamCount);
        setValue('Материалы_Сетка_мп', meshCount);
        setValue('Материалы_Гидроизол_рул', hydroCount);

        // Итоговые поля
        setValue('Количество_Фур', trucksCount);
        setValue('Итого_Стоимость_Блоков', blocksCost + packagingPrice);
        setValue('Итого_Стройматериалы_руб', totalMaterialsCost);
        setValue('ИТОГО_К_ОПЛАТЕ_РУБ', finalTotal);
    }

    // СЛУШАТЕЛИ СОБЫТИЙ
    form.addEventListener('input', e => {
        if (e.target.matches('input, select')) calculate();
    });
    form.addEventListener('change', e => {
        if (e.target.matches('input, select')) calculate();
    });

    // AJAX ОТПРАВКА ЧЕРЕЗ FORMSPREE
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('calculatorMessage');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {'Accept': 'application/json'}
        })
            .then(response => {
                if (response.ok) {
                    statusDiv.style.color = '#6fba81';
                    statusDiv.textContent = 'Спасибо! Ваш расчёт успешно отправлен.';
                    form.reset();
                    calculate(); // Пересчитываем после сброса
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            statusDiv.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            statusDiv.textContent = 'Произошла ошибка при отправке.';
                        }
                    });
                    statusDiv.style.color = '#ff8b94';
                }
            })
            .catch(() => {
                statusDiv.style.color = '#ff8b94';
                statusDiv.textContent = 'Ошибка сети. Попробуйте позже.';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Получить расчёт';
            });
    });

    document.getElementById('PO_col')?.addEventListener('change', () => {
        updateVisibility('PO_col', '.window-type');
        calculate();
    });
    document.getElementById('PDD')?.addEventListener('change', () => {
        updateVisibility('PDD', '.door-type');
        calculate();
    });
    document.getElementById('PFD_col_frontonov')?.addEventListener('change', () => {
        const count = number(document.getElementById('PFD_col_frontonov').value);
        if (document.getElementById('additionalGable1')) {
            document.getElementById('additionalGable1').style.display = count >= 2 ? '' : 'none';
        }
        if (document.getElementById('additionalGable2')) {
            document.getElementById('additionalGable2').style.display = count >= 3 ? '' : 'none';
        }
        calculate();
    });

    // Инициализация при загрузке
    updateVisibility('PO_col', '.window-type');
    updateVisibility('PDD', '.door-type');
    calculate();

})();