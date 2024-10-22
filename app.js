const VehicleDamageTracker = (function() {

    const MAX_DAMAGE_RATE = 5;
    const MIN_DAMAGE_RATE = 1;

    function createDamage(part, rate) {
        if (typeof part !== 'string' || part.trim() === '') {
            throw new Error('Part должен быть непустой строкой');
        }
        if (!Number.isInteger(rate) || rate < MIN_DAMAGE_RATE || rate > MAX_DAMAGE_RATE) {
            throw new Error(`Rate должен быть целым числом от ${MIN_DAMAGE_RATE} до ${MAX_DAMAGE_RATE}`);
        }
        return { part, rate, date: new Date() };
    }

    class Vehicle {
        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = year;
            this.damages = [];
        }

        get info() {
            return `${this.make} ${this.model} (${this.year})`;
        }

        addDamage(part, rate) {
            const damage = createDamage(part, rate);
            this.damages.push(damage);
            console.log(`У авто ${this.info} добавлено:
            - повреждение "${damage.part}" со степенью ${damage.rate} (${damage.date.toLocaleString()})`);
            return damage;
        }

        getTotalDamage() {
            return this.damages.reduce((sum, damage) => sum + damage.rate, 0);
        }

        getDamagesList() {
            return this.damages.map(damage => 
                `${damage.part}: ${damage.rate} (${damage.date.toLocaleString()})`
            ).join('\n');
        }

        clearDamages() {
            const count = this.damages.length;
            this.damages = [];
            console.log(`Список повреждений для ${this.info} очищен (удалено ${count} записей)`);
            return count;
        }


        getDamageStatistics() {
            const stats = {
                totalDamages: this.damages.length,
                averageDamageRate: 0,
                mostDamagedPart: '',
                maxDamageRate: 0
            };

            if (stats.totalDamages > 0) {
                const partCounts = {};
                let totalRate = 0;

                this.damages.forEach(damage => {
                    totalRate += damage.rate;
                    partCounts[damage.part] = (partCounts[damage.part] || 0) + 1;
                    if (damage.rate > stats.maxDamageRate) {
                        stats.maxDamageRate = damage.rate;
                    }
                });

                stats.averageDamageRate = totalRate / stats.totalDamages;
                stats.mostDamagedPart = Object.entries(partCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            }

            return stats;
        }
    }

    // Публичный API
    return {
        createVehicle: (make, model, year) => new Vehicle(make, model, year)
    };
})();

// Пример использования
const audi = VehicleDamageTracker.createVehicle('Audi', 'A3', 2021);

audi.addDamage('Бампер передний', 3);
audi.addDamage('Капот', 2);
audi.addDamage('Дверь водителя', 4);
audi.addDamage('Крыло заднее правое', 1);
audi.addDamage('Фара левая', 5);

console.log('\nСписок повреждений:');
console.log(audi.getDamagesList());

console.log('\nОбщая степень повреждений:', audi.getTotalDamage());

console.log('\nСтатистика повреждений:');
console.log(audi.getDamageStatistics());

const clearedCount = audi.clearDamages();
console.log(`Очищено ${clearedCount} записей о повреждениях`);