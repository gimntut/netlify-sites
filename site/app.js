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
        levelTime: 3,
        pupilMoney: 10,
        teacherMoney: 10,
        init: function(app) {
            this.app = app;
            // this.teacherMoney = 10;
            this.rules = [];
            this.max_value = 0;
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
        question: null,
        screen2: null,
        question2: null,
        screen3: null,
        timer: null,
        teacherMoney: null,
        pupilMoney: null,
        gameover: null,
    };
    var tout1, int1, time;

    function money(n) {
        result = []
        while (n >= 100) {
            result.push('<div class="rubin"></div>');
            n -= 100;
        }
        while (n >= 10) {
            result.push('<div class="gold"></div>');
            n -= 10;
        }
        while (n > 0) {
            result.push('<div class="silver"></div>');
            n -= 1;
        }
        return result.join('\n');
    }

    function showMoney() {
        elements.pupilMoney.innerHTML = '<div class="pupil"></div>' + money(game.pupilMoney);
        elements.teacherMoney.innerHTML = '<div class="teacher"></div>' + money(game.teacherMoney);
    }

    function screen(scrNum) {
        var screens = [1, 2, 3];
        screens.forEach(function(item) {
            if (item != scrNum) {
                content.classList.remove('screen-' + item);
            }
        });
        content.classList.add('screen-' + scrNum);
    }

    function stopTimer() {
        if (int1 != 0) {
            clearInterval(int1);
            int1 = 0;
            elements.timer.innerText = ' ';
        }
    }
    return {
        run: function() {
            for (key in elements) {
                elements[key] = document.getElementById(key);
            }
            game.init();
            screen(1);
            showMoney();
            this.getText();

        },
        getText: function() {
            var text = game.getText();
            elements.question.innerText = text;
            elements.question2.innerText = text;
            this.runTimer(game.levelTime);
        },
        runTimer: function(t) {
            stopTimer();
            time = t;
            int1 = setInterval(this.timer, 1000);
        },
        timer: function() {
            if (time === 0) {
                stopTimer();
                screen(2);
            } else {
                elements.timer.innerText = ['Осталось ', time, ' сек'].join('');
            }
            time -= 1;
        },
        pupilWin: function() {
            game.pupilMoney += 1;
            game.teacherMoney -= 1;
            showMoney();
            this.levelUp();
        },
        teacherWin: function() {
            game.pupilMoney -= 1;
            game.teacherMoney += 1;
            showMoney();
            this.levelUp();
        },
        levelUp: function() {
            if (game.pupilMoney === 0 || game.teacherMoney === 0) {
                this.gameOver();
                return;
            }
            game.levelUp();
            this.getText();
            screen(1);
            this.runTimer(game.levelTime);
        },
        gameOver: function() {
            if (game.pupilMoney === 0) {
                elements.gameover.innerHTML = [
                    'Выиграл ',
                    '<div class="teacher"></div>',
                    'учитель'
                ].join('');
            }
            if (game.teacherMoney === 0) {
                elements.gameover.innerHTML = [
                    'Выиграл ',
                    '<div class="pupil"></div>',
                    'ученик'
                ].join('');
            }
            stopTimer();
            screen(3);
        },
        restart: function() {
            game.init();
            game.pupilMoney = game.pupilMoney === 0 ? 10 : game.pupilMoney;
            game.teacherMoney = game.teacherMoney === 0 ? 10 : game.teacherMoney;
            screen(1);
            showMoney();
            this.getText();
        },
    }
})();
document.addEventListener('DOMContentLoaded', function() {
    app.run();
});