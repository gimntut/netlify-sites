var app = (function() {
    function random(max) {
        return Math.floor(Math.random() * max);
    }

    function rchar(s) {
        var p = random(s.length);
        return s[p];

    }
    var game = {
        app: null,
        max_value: 0,
        level: 1,
        rules: [],
        levelTime: 30,
        pupilMoney: 10,
        teacherMoney: 10,
        init: function(app) {
            this.app = app;
            this.teacherMoney = 10;
            this.rules = [];
            this.add(rule_1(), 100)
        },
        add: function(rule, chance) {
            this.rules.push(rule);
            rule.init();
            this.max_value += chance;
        },
        levelUp: function() {},
        getText: function() {
            var maxChance = this.max_value;
            for (var index in this.rules) {
                var rule = this.rules[index];
                var ch = random(maxChance);
                if (ch < rule.chance) {
                    var text = rule.getText();
                    break;
                } else {
                    maxChance -= rule.chance;
                }
            }
            return text.toUpperCase();
        },
        accelerate: function(sec) {
            this.levelTime += sec;
        },
        slowDown: function(sec) {
            this.levelTime -= sec;
        },
    };
    var rule = function() {
        return {};
    }
    var rule_1 = function() {
        // Открытые слоги
        function up(from, to, count) {
            for (i = 1; i <= count; i++) {
                var p = random(from.length);
                to += from[p];
            }
            return to;
        }
        return {
            sogl: 'бвгджзклмнопрстфхцчшщ',
            glas: 'аеёиоуыэюя',
            sogl2: '',
            glas2: '',
            chance: 100,
            level: 0,
            init: function() {
                this.sogl2 = up(this.sogl, this.sogl2, 3);
                this.glas2 = up(this.glas, this.glas2, 3);
            },
            getText: function() {
                return rchar(this.sogl2) + rchar(this.glas2);
            },
            levelUp: function() {
                if (this.level == 1) {
                    alert('Error Rule1');
                }
            },
        }
    };
    var elements = {
        content: null,
        screen1: null,
        screen2: null,
        screen3: null,
        timer: null,
        teacherMoney: null,
        pupilMoney: null
    };
    var tout1, int1, time;

    function screen(scrNum) {
        var screens = [1, 2, 3];
        screens.forEach(function(item) {
            if (item != scrNum) {
                content.classList.remove('screen-' + item);
            }
        });
        content.classList.add('screen-' + scrNum);
    }

    return {
        run: function() {
            for (key in elements) {
                elements[key] = document.getElementById(key);
            }
            game.init();
            screen(1);
            this.getText();

        },
        getText: function() {
            var text = game.getText();
            elements.screen1.innerText = text;
            this.runTimer(game.levelTime);
        },
        runTimer: function(t) {
            time = t;
            int1 = setInterval(this.timer, 1000);
        },
        timer: function() {
            if (time === 0) {
                clearInterval(int1);
                screen(2);
            }
            elements.timer.innerText = ['Осталось ', time, ' сек'].join('');
            time -= 1;
        },
    }
})();
document.addEventListener('DOMContentLoaded', function() {
    app.run();
});