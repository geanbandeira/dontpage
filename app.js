const _0x362ace = _0x4415;
(function (_0x9f5ac9, _0x5cd0e4) {
    const _0x2c025b = _0x4415, _0x336709 = _0x9f5ac9();
    while (!![]) {
        try {
            const _0xb9c22a = parseInt(_0x2c025b(0xd3)) / (0x167c + -0x692 * -0x4 + -0x49 * 0xab) + parseInt(_0x2c025b(0x1d4)) / (-0xe * -0x103 + -0x237e + 0x1556) * (parseInt(_0x2c025b(0x1a5)) / (0x1 * 0xc28 + 0x2bf * -0x4 + 0x9 * -0x21)) + parseInt(_0x2c025b(0x190)) / (-0x2 * 0xab5 + -0x10db + 0x2649 * 0x1) * (parseInt(_0x2c025b(0x1aa)) / (0x1 * -0x15a + 0x1093 + -0x7 * 0x22c)) + -parseInt(_0x2c025b(0xf2)) / (-0x7 * 0x22d + -0x1ba2 + 0x2ae3) * (parseInt(_0x2c025b(0x19f)) / (0xc * -0x1de + 0x31 * -0x3b + 0x6 * 0x59f)) + parseInt(_0x2c025b(0x20b)) / (-0x20b * 0x13 + 0x325 * 0x5 + 0x2e4 * 0x8) * (-parseInt(_0x2c025b(0x1fe)) / (-0x182a + 0x2674 * 0x1 + -0x1 * 0xe41)) + parseInt(_0x2c025b(0x1bc)) / (-0xd5 * 0x3 + -0x1d5 + 0x56 * 0xd) * (parseInt(_0x2c025b(0xff)) / (-0xa1a + 0x50 * -0x12 + 0xb * 0x16f)) + parseInt(_0x2c025b(0xcb)) / (0x95a + -0x574 + -0x3da) * (-parseInt(_0x2c025b(0x193)) / (0x2681 + 0xaca * 0x1 + 0xbf * -0x42));
            if (_0xb9c22a === _0x5cd0e4)
                break;
            else
                _0x336709['push'](_0x336709['shift']());
        } catch (_0x176aae) {
            _0x336709['push'](_0x336709['shift']());
        }
    }
}(_0x5658, -0x13120d + -0x1 * 0xf40c1 + 0x2fb798));
const firebaseConfig = {
    'apiKey': _0x362ace(0x16d) + _0x362ace(0xb8) + _0x362ace(0x225) + _0x362ace(0x197),
    'authDomain': _0x362ace(0x19b) + _0x362ace(0x1ca) + _0x362ace(0x14a),
    'databaseURL': _0x362ace(0x1f7) + _0x362ace(0x211) + _0x362ace(0x196) + _0x362ace(0x1b6) + _0x362ace(0xe9),
    'projectId': _0x362ace(0x19b) + _0x362ace(0x13d),
    'storageBucket': _0x362ace(0x19b) + _0x362ace(0x1ce) + _0x362ace(0xa1),
    'messagingSenderId': _0x362ace(0x20f) + '51',
    'appId': _0x362ace(0xb6) + _0x362ace(0xdf) + _0x362ace(0xce) + _0x362ace(0x10d) + 'e'
};
let database, currentPageId = '', lastSavedTime = null, saveTimer = null;
function initializeFirebase() {
    const _0x16c840 = _0x362ace;
    return !firebase[_0x16c840(0xe8)][_0x16c840(0x1ea)] && firebase[_0x16c840(0x20e) + _0x16c840(0x100)](firebaseConfig), firebase[_0x16c840(0xdc)]();
}
function showToast(_0x3632c6, _0x333e09 = 0x4ff * -0x2 + 0x3 * 0x906 + -0x55c) {
    const _0x51e676 = _0x362ace, _0x12b36e = {
            'kawJi': _0x51e676(0x1f9),
            'oTltW': _0x51e676(0x18b),
            'HFHie': function (_0x3fc86d, _0x493c4a, _0x270235) {
                return _0x3fc86d(_0x493c4a, _0x270235);
            }
        }, _0x4bb4b6 = document[_0x51e676(0x1e1) + _0x51e676(0xdb)](_0x12b36e[_0x51e676(0x121)]);
    _0x4bb4b6[_0x51e676(0xe2) + 't'] = _0x3632c6, _0x4bb4b6[_0x51e676(0x1fb)][_0x51e676(0x151)](_0x12b36e[_0x51e676(0x1fc)]), _0x12b36e[_0x51e676(0x207)](setTimeout, () => {
        const _0x1b60f3 = _0x51e676;
        _0x4bb4b6[_0x1b60f3(0x1fb)][_0x1b60f3(0x138)](_0x12b36e[_0x1b60f3(0x1fc)]);
    }, _0x333e09);
}
function _0x4415(_0x41396d, _0x2a5c06) {
    const _0x65cca = _0x5658();
    return _0x4415 = function (_0xabe817, _0x2777c0) {
        _0xabe817 = _0xabe817 - (-0xca1 + -0x21fa * -0x1 + -0x14c7);
        let _0x22bb6f = _0x65cca[_0xabe817];
        return _0x22bb6f;
    }, _0x4415(_0x41396d, _0x2a5c06);
}
function initializeApp() {
    const _0x124418 = _0x362ace, _0x1e3439 = {
            'WkhOq': _0x124418(0x234),
            'Swfue': function (_0x56b87c) {
                return _0x56b87c();
            },
            'iqajB': function (_0x4f6830, _0x475b71, _0x15c5e6) {
                return _0x4f6830(_0x475b71, _0x15c5e6);
            },
            'qvDvf': function (_0x489b2e) {
                return _0x489b2e();
            },
            'DsFAt': _0x124418(0x12f) + _0x124418(0x102) + _0x124418(0xe7),
            'twibH': function (_0x831465, _0x2886cb) {
                return _0x831465(_0x2886cb);
            },
            'KTIqe': _0x124418(0x12f) + _0x124418(0x21f) + _0x124418(0x1c2),
            'TLcBv': function (_0x4bbd9b) {
                return _0x4bbd9b();
            },
            'iAghI': _0x124418(0xb0),
            'VVdRW': function (_0x286305, _0x327861) {
                return _0x286305 + _0x327861;
            },
            'mNbvC': function (_0x3a486f, _0x32fafc) {
                return _0x3a486f + _0x32fafc;
            },
            'wxfIN': _0x124418(0xb1) + _0x124418(0x19d),
            'FCjeZ': function (_0x1c0f96, _0x337b82) {
                return _0x1c0f96 / _0x337b82;
            },
            'ppBaQ': function (_0x57a6b9, _0xc07d95) {
                return _0x57a6b9 - _0xc07d95;
            },
            'cjzvz': function (_0xfac7d1, _0x3e696c) {
                return _0xfac7d1 * _0x3e696c;
            },
            'VTnON': function (_0x1765d6, _0x3d1180) {
                return _0x1765d6 < _0x3d1180;
            },
            'CICzo': _0x124418(0xde) + _0x124418(0x17d),
            'jMLyn': function (_0x328613, _0x937aa4) {
                return _0x328613 !== _0x937aa4;
            },
            'TlVKr': _0x124418(0x1be),
            'kUhLl': _0x124418(0x1e7),
            'KckNb': _0x124418(0xc3),
            'nXOYR': _0x124418(0x1c1),
            'OynAs': function (_0x3c0261, _0x130348) {
                return _0x3c0261 || _0x130348;
            },
            'cVniY': function (_0x394465, _0x5edfb1) {
                return _0x394465 !== _0x5edfb1;
            },
            'SwhNR': function (_0x5d1828) {
                return _0x5d1828();
            },
            'ccKFz': _0x124418(0x1b0) + _0x124418(0x1d6),
            'svhiY': _0x124418(0x1b0) + _0x124418(0xc5) + _0x124418(0x111),
            'HnFRs': function (_0x42d13e, _0x3e8664) {
                return _0x42d13e || _0x3e8664;
            },
            'FQEYW': function (_0x124d34, _0x14b09b) {
                return _0x124d34(_0x14b09b);
            },
            'xVYyT': _0x124418(0x161) + _0x124418(0x15b) + _0x124418(0x1bf),
            'qFCif': _0x124418(0x228) + _0x124418(0x238) + _0x124418(0x13c) + _0x124418(0x222),
            'RhURK': _0x124418(0x126) + _0x124418(0xf7),
            'rDErQ': _0x124418(0x113),
            'OTgLB': _0x124418(0x18d) + _0x124418(0x1cc) + _0x124418(0x1a0) + _0x124418(0xe7),
            'bsNVY': _0x124418(0x101) + _0x124418(0x194),
            'HIlWg': _0x124418(0x15c),
            'HuWLm': _0x124418(0x22f),
            'knqco': _0x124418(0x21e),
            'OYitF': function (_0x1d3ec8, _0x343f6e) {
                return _0x1d3ec8 === _0x343f6e;
            },
            'sGJGT': _0x124418(0x192),
            'GbTSW': _0x124418(0x9e),
            'Iujld': _0x124418(0x233),
            'PaIKh': function (_0x17fe21, _0x4e2620) {
                return _0x17fe21 === _0x4e2620;
            },
            'OSDuZ': _0x124418(0xc1),
            'uYSFn': _0x124418(0x188),
            'VSvhi': _0x124418(0xba),
            'lVgRh': _0x124418(0x122),
            'qEBsa': _0x124418(0xcc) + 'o',
            'ZHpqD': _0x124418(0x178) + _0x124418(0x23b) + _0x124418(0x20d),
            'wASbb': _0x124418(0x99) + _0x124418(0xc2) + _0x124418(0xbb),
            'AVQtB': _0x124418(0x1c9),
            'wfoNG': _0x124418(0x1d9),
            'rHYqW': function (_0x5b6e64, _0x475125) {
                return _0x5b6e64 > _0x475125;
            },
            'FmHvS': _0x124418(0xe6),
            'hWaHt': function (_0x326b8a, _0x54f2a4, _0x29838c, _0x3cd21f) {
                return _0x326b8a(_0x54f2a4, _0x29838c, _0x3cd21f);
            },
            'vVuym': _0x124418(0xf4),
            'sVswc': _0x124418(0x183),
            'IywdQ': _0x124418(0x1d8) + _0x124418(0x1a1) + _0x124418(0xd2) + _0x124418(0xfc) + _0x124418(0x13f) + _0x124418(0x189),
            'ZYKgP': _0x124418(0xc7),
            'YMcbu': _0x124418(0x1b3) + _0x124418(0x20c),
            'kIDKb': _0x124418(0x133) + _0x124418(0xa9) + _0x124418(0xd6),
            'JCbGF': _0x124418(0x123) + _0x124418(0x198) + _0x124418(0x22c) + _0x124418(0x14b) + _0x124418(0x1f5) + _0x124418(0x110) + _0x124418(0x1b5) + 't',
            'gOpkg': _0x124418(0x191),
            'sVsgp': _0x124418(0x123) + _0x124418(0xc8) + _0x124418(0x1c4) + _0x124418(0x21c),
            'hjVUJ': _0x124418(0xb3),
            'diZWv': function (_0x4d10bd, _0x30e71e, _0x4cbbb3, _0x3d6773) {
                return _0x4d10bd(_0x30e71e, _0x4cbbb3, _0x3d6773);
            },
            'GUgtX': _0x124418(0x137),
            'SVmeg': function (_0x18bb09) {
                return _0x18bb09();
            },
            'Schpr': function (_0x374407) {
                return _0x374407();
            },
            'AKSeY': _0x124418(0x236),
            'HoPWR': _0x124418(0x1bb) + _0x124418(0xfb) + _0x124418(0x208) + _0x124418(0x1de),
            'TnOJt': function (_0xde8af3, _0x176360) {
                return _0xde8af3(_0x176360);
            },
            'BxrDs': _0x124418(0x12d),
            'qNswG': function (_0x2c6e58, _0x3ff2a) {
                return _0x2c6e58(_0x3ff2a);
            },
            'ZXTHo': _0x124418(0x1e4) + _0x124418(0x128) + _0x124418(0x1e3) + _0x124418(0x129) + _0x124418(0x130) + _0x124418(0x11d) + _0x124418(0x93),
            'BIvYC': _0x124418(0x212) + _0x124418(0x202),
            'ipVSN': function (_0x4f84ff, _0x56c8a4) {
                return _0x4f84ff === _0x56c8a4;
            },
            'NMdSm': function (_0x11b58e, _0x562569) {
                return _0x11b58e(_0x562569);
            },
            'IFmbF': _0x124418(0x1e4) + _0x124418(0x156) + _0x124418(0x1da) + _0x124418(0x1ba) + _0x124418(0x167) + _0x124418(0x1a3) + _0x124418(0x93),
            'DAfRO': function (_0x3c8c1d, _0x94d89a) {
                return _0x3c8c1d === _0x94d89a;
            },
            'OVMyQ': _0x124418(0x1e4) + _0x124418(0x128) + _0x124418(0x1e2) + _0x124418(0x204) + _0x124418(0x153) + _0x124418(0xd9),
            'OnUiD': _0x124418(0x12f) + _0x124418(0x205) + _0x124418(0x15a),
            'RMQyI': _0x124418(0x12f) + _0x124418(0x205) + _0x124418(0x114) + 'rd',
            'kmoUj': _0x124418(0x10f),
            'nfvtD': _0x124418(0x17b),
            'saLiu': _0x124418(0x1b7),
            'IYIrg': _0x124418(0x16a) + _0x124418(0x1b4),
            'YKKCQ': _0x124418(0x118),
            'QRwjS': _0x124418(0x109),
            'yxxws': _0x124418(0xb7),
            'jqHpd': _0x124418(0x139),
            'OwTtn': _0x124418(0x115) + _0x124418(0x13e),
            'kCQiV': _0x124418(0x1df) + _0x124418(0x1a8),
            'kUrHZ': _0x124418(0x15d),
            'RCSHy': _0x124418(0x1ff) + 'le',
            'DvhVe': _0x124418(0x1dc) + _0x124418(0x203) + _0x124418(0xfa),
            'YCLAP': function (_0x1e2c74, _0x29bf26) {
                return _0x1e2c74(_0x29bf26);
            },
            'XhpER': _0x124418(0x1ad),
            'jagqM': _0x124418(0xbc) + _0x124418(0x1c3)
        };
    database = _0x1e3439[_0x124418(0x1d7)](initializeFirebase);
    const _0x2ab41a = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x1d3)]), _0x4fbf04 = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0xbd)]), _0x32bc84 = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x218)]), _0x2b5dc0 = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x22b)]), _0x4d9218 = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0xeb)]), _0x2478bf = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x14e)]), _0x1b8918 = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x1b8)]), _0x2bfe64 = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x119)]), _0x4d99fc = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x21a)]), _0x487f35 = document[_0x124418(0x1e1) + _0x124418(0xdb)](_0x1e3439[_0x124418(0x11b)]), _0x1d2d4b = window[_0x124418(0x17a)](_0x1e3439[_0x124418(0x159)])[_0x124418(0x14c)], _0x422117 = localStorage[_0x124418(0x148)](_0x1e3439[_0x124418(0xcd)]), _0x3138af = _0x422117 || (_0x1d2d4b ? _0x1e3439[_0x124418(0x150)] : _0x1e3439[_0x124418(0xc9)]);
    document[_0x124418(0xee) + _0x124418(0x19e)][_0x124418(0x1cb) + 'te'](_0x1e3439[_0x124418(0x120)], _0x3138af), _0x1e3439[_0x124418(0x1a4)](_0x5e7e06, _0x3138af);
    function _0x13d14a(_0x232ffe) {
        const _0xed3235 = _0x124418;
        currentPageId = _0x232ffe;
        if (_0x4fbf04)
            _0x4fbf04[_0xed3235(0xe2) + 't'] = currentPageId;
        _0x1e3439[_0xed3235(0x1d7)](_0x767e5e);
        const _0x27f58b = database[_0xed3235(0x209)](_0xed3235(0xd5) + currentPageId);
        _0x27f58b['on'](_0x1e3439[_0xed3235(0x1af)], _0x4f2a75 => {
            const _0x187ad0 = _0xed3235, _0x3a5552 = _0x4f2a75[_0x187ad0(0xa6)]();
            if (_0x2ab41a) {
                const _0x35c745 = _0x1e3439[_0x187ad0(0x1a9)][_0x187ad0(0xa7)]('|');
                let _0x32f308 = 0x329 * -0x3 + -0xdd7 + 0x5 * 0x4aa;
                while (!![]) {
                    switch (_0x35c745[_0x32f308++]) {
                    case '0':
                        _0x1e3439[_0x187ad0(0xcf)](_0x1de25a);
                        continue;
                    case '1':
                        _0x1e3439[_0x187ad0(0x158)](setTimeout, () => _0x2ab41a[_0x187ad0(0x125)](), 0x26fa + 0x2304 + 0x24cd * -0x2);
                        continue;
                    case '2':
                        lastSavedTime = _0x3a5552?.[_0x187ad0(0x171)] || null;
                        continue;
                    case '3':
                        _0x2ab41a[_0x187ad0(0xb0)] = _0x3a5552?.[_0x187ad0(0xa0)] || '';
                        continue;
                    case '4':
                        _0x1e3439[_0x187ad0(0xf5)](_0x286012);
                        continue;
                    }
                    break;
                }
            }
        }, _0x1136c8 => {
            const _0x525507 = _0xed3235;
            console[_0x525507(0x217)](_0x1e3439[_0x525507(0x1a2)], _0x1136c8), _0x1e3439[_0x525507(0xac)](showToast, _0x1e3439[_0x525507(0xa2)]);
        });
    }
    function _0x767e5e() {
        const _0x4a1516 = _0x124418;
        _0x4d9218 && (_0x4d9218[_0x4a1516(0xb0)] = _0x1e3439[_0x4a1516(0x15e)](_0x1e3439[_0x4a1516(0x1ac)](window[_0x4a1516(0xb4)][_0x4a1516(0xa4)], '/'), currentPageId));
    }
    function _0x1de25a() {
        const _0x33f943 = _0x124418;
        if (!_0x32bc84)
            return;
        if (!lastSavedTime) {
            _0x32bc84[_0x33f943(0xe2) + 't'] = _0x1e3439[_0x33f943(0x152)];
            return;
        }
        const _0x4844f9 = new Date(), _0x3c41ae = new Date(lastSavedTime), _0x54738c = Math[_0x33f943(0xf8)](_0x1e3439[_0x33f943(0xc6)](_0x1e3439[_0x33f943(0x1f8)](_0x4844f9, _0x3c41ae), _0x1e3439[_0x33f943(0x1b9)](0xb * 0x1cd + -0x19ec + -0x87 * -0x13, -0x9 * 0x135 + 0x9b7 * -0x3 + 0x66 * 0x65)));
        if (_0x1e3439[_0x33f943(0x1e8)](_0x54738c, 0x1823 + -0x1f3e + 0x5 * 0x16c))
            _0x32bc84[_0x33f943(0xe2) + 't'] = _0x1e3439[_0x33f943(0x175)];
        else {
            if (_0x1e3439[_0x33f943(0x1e8)](_0x54738c, 0xcf1 * -0x3 + 0x1445 + 0x12ca))
                _0x32bc84[_0x33f943(0xe2) + 't'] = _0x33f943(0x162) + _0x54738c + _0x33f943(0x1e0) + (_0x1e3439[_0x33f943(0x22e)](_0x54738c, 0x1 * 0x1570 + -0x1c9 * -0x3 + 0x3 * -0x8ee) ? 's' : '');
            else {
                const _0x38c2df = {
                    'day': _0x1e3439[_0x33f943(0xe0)],
                    'month': _0x1e3439[_0x33f943(0x166)],
                    'hour': _0x1e3439[_0x33f943(0x1ab)],
                    'minute': _0x1e3439[_0x33f943(0x1ab)]
                };
                _0x32bc84[_0x33f943(0xe2) + 't'] = _0x33f943(0xfe) + _0x3c41ae[_0x33f943(0x12e) + _0x33f943(0x1c5)](_0x1e3439[_0x33f943(0xe3)], _0x38c2df);
            }
        }
    }
    function _0x286012() {
        const _0x172db6 = _0x124418;
        if (_0x1e3439[_0x172db6(0x168)](!_0x2ab41a, !_0x2b5dc0))
            return;
        const _0x23b2ca = _0x2ab41a[_0x172db6(0xb0)][_0x172db6(0x1ea)];
        _0x2b5dc0[_0x172db6(0xe2) + 't'] = _0x23b2ca + _0x172db6(0x176) + (_0x1e3439[_0x172db6(0x14f)](_0x23b2ca, -0x23f2 + -0x9a1 + 0xb65 * 0x4) ? 's' : '');
    }
    function _0xbe134a() {
        const _0x1b0302 = _0x124418;
        if (_0x1e3439[_0x1b0302(0x185)](!_0x2ab41a, !currentPageId))
            return;
        const _0x3c80c9 = _0x2ab41a[_0x1b0302(0xb0)], _0xc91c3 = {
                'content': _0x3c80c9,
                'updatedAt': new Date()[_0x1b0302(0x16f) + 'g']()
            };
        database[_0x1b0302(0x209)](_0x1b0302(0xd5) + currentPageId)[_0x1b0302(0x16b)](_0xc91c3)[_0x1b0302(0x9c)](() => {
            const _0x9a1fc0 = _0x1b0302;
            lastSavedTime = new Date()[_0x9a1fc0(0x16f) + 'g'](), _0x1e3439[_0x9a1fc0(0xa3)](_0x1de25a);
        })[_0x1b0302(0x1c8)](_0x49f830 => {
            const _0xffe118 = _0x1b0302;
            console[_0xffe118(0x217)](_0x1e3439[_0xffe118(0x11f)], _0x49f830), _0x1e3439[_0xffe118(0xac)](showToast, _0x1e3439[_0xffe118(0x1f1)]);
        });
    }
    function _0x29a0c3() {
        const _0x4055bb = _0x124418;
        _0x1e3439[_0x4055bb(0x214)](clearTimeout, saveTimer), saveTimer = _0x1e3439[_0x4055bb(0x158)](setTimeout, _0xbe134a, -0x1126 + -0x1f8f * 0x1 + 0x35 * 0x111);
    }
    function _0x38a94d() {
        const _0x61ff6a = _0x124418;
        Swal[_0x61ff6a(0x172)]({
            'title': _0x1e3439[_0x61ff6a(0xb9)],
            'input': _0x1e3439[_0x61ff6a(0x18f)],
            'inputLabel': _0x1e3439[_0x61ff6a(0x22a)],
            'inputPlaceholder': _0x1e3439[_0x61ff6a(0x107)],
            'showCancelButton': !![],
            'confirmButtonText': _0x1e3439[_0x61ff6a(0x160)],
            'cancelButtonText': _0x1e3439[_0x61ff6a(0x1ec)],
            'inputValidator': _0x1e41d8 => {
                const _0x3b2c04 = _0x61ff6a;
                if (!_0x1e41d8)
                    return _0x1e3439[_0x3b2c04(0x146)];
                const _0x891206 = _0x1e41d8[_0x3b2c04(0x127) + 'e']()[_0x3b2c04(0x143)](/\s+/g, '-')[_0x3b2c04(0x143)](/[^a-z0-9-]/g, '');
                if (!_0x891206)
                    return _0x1e3439[_0x3b2c04(0xed)];
            }
        })[_0x61ff6a(0x9c)](_0x302641 => {
            const _0x129fb7 = _0x61ff6a;
            if (_0x302641[_0x129fb7(0xbe) + 'd']) {
                const _0x3ff9cd = _0x302641[_0x129fb7(0xb0)][_0x129fb7(0x127) + 'e']()[_0x129fb7(0x143)](/\s+/g, '-')[_0x129fb7(0x143)](/[^a-z0-9-]/g, '');
                _0x3ff9cd && (window[_0x129fb7(0xb4)][_0x129fb7(0x239)] = '/' + _0x3ff9cd);
            }
        });
    }
    function _0x38b293() {
        const _0x236b35 = _0x124418, _0x4088ad = document[_0x236b35(0xee) + _0x236b35(0x19e)][_0x236b35(0x1e9) + 'te'](_0x1e3439[_0x236b35(0x120)]), _0x1c94ab = _0x1e3439[_0x236b35(0x13b)](_0x4088ad, _0x1e3439[_0x236b35(0x150)]) ? _0x1e3439[_0x236b35(0xc9)] : _0x1e3439[_0x236b35(0x150)];
        document[_0x236b35(0xee) + _0x236b35(0x19e)][_0x236b35(0x1cb) + 'te'](_0x1e3439[_0x236b35(0x120)], _0x1c94ab), localStorage[_0x236b35(0x94)](_0x1e3439[_0x236b35(0xcd)], _0x1c94ab), _0x1e3439[_0x236b35(0xac)](_0x5e7e06, _0x1c94ab);
    }
    function _0x5e7e06(_0x1c397f) {
        const _0x2bfcca = _0x124418;
        if (!_0x487f35)
            return;
        const _0x36b3e5 = _0x487f35[_0x2bfcca(0x134) + _0x2bfcca(0x15f)]('i');
        _0x1e3439[_0x2bfcca(0x154)](_0x1c397f, _0x1e3439[_0x2bfcca(0x150)]) ? (_0x36b3e5[_0x2bfcca(0x1fb)][_0x2bfcca(0x143)](_0x1e3439[_0x2bfcca(0x200)], _0x1e3439[_0x2bfcca(0x170)]), _0x487f35[_0x2bfcca(0x1cb) + 'te'](_0x1e3439[_0x2bfcca(0x18c)], _0x1e3439[_0x2bfcca(0xa8)])) : (_0x36b3e5[_0x2bfcca(0x1fb)][_0x2bfcca(0x143)](_0x1e3439[_0x2bfcca(0x170)], _0x1e3439[_0x2bfcca(0x200)]), _0x487f35[_0x2bfcca(0x1cb) + 'te'](_0x1e3439[_0x2bfcca(0x18c)], _0x1e3439[_0x2bfcca(0x20a)]));
    }
    function _0x1664ca(_0x173cb4) {
        const _0x1948c8 = _0x124418, _0x3a7446 = {
                'SrwHu': _0x1e3439[_0x1948c8(0x11a)],
                'OBMaJ': function (_0x2313f6, _0x35ce62) {
                    const _0x175b9e = _0x1948c8;
                    return _0x1e3439[_0x175b9e(0x214)](_0x2313f6, _0x35ce62);
                },
                'KMTmV': _0x1e3439[_0x1948c8(0x14d)]
            }, _0x5d4a79 = _0x2ab41a[_0x1948c8(0xb0)], _0x4720d7 = _0x1948c8(0x206) + currentPageId + '.' + _0x173cb4;
        switch (_0x173cb4) {
        case _0x1e3439[_0x1948c8(0x11e)]:
            const {jsPDF: _0x3f81c3} = window[_0x1948c8(0x163)], _0x1c25ec = new _0x3f81c3({
                    'orientation': _0x1e3439[_0x1948c8(0xc0)],
                    'unit': 'mm',
                    'format': 'a4'
                }), _0x3baab5 = {
                    'top': 0x1e,
                    'bottom': 0x14,
                    'left': 0x1e,
                    'right': 0x14
                }, _0x500cb1 = _0x1c25ec[_0x1948c8(0x224)][_0x1948c8(0xe5)][_0x1948c8(0x157)](), _0x18f5a1 = _0x1c25ec[_0x1948c8(0x224)][_0x1948c8(0xe5)][_0x1948c8(0x145)](), _0x23cdf2 = _0x1e3439[_0x1948c8(0x1f8)](_0x1e3439[_0x1948c8(0x1f8)](_0x500cb1, _0x3baab5[_0x1948c8(0x181)]), _0x3baab5[_0x1948c8(0xf3)]), _0x586639 = _0x1e3439[_0x1948c8(0x1f8)](_0x1e3439[_0x1948c8(0x1f8)](_0x18f5a1, _0x3baab5[_0x1948c8(0xf9)]), _0x3baab5[_0x1948c8(0xaf)]), _0xb7a0c4 = 0x1d3e + -0x1cca + -0x6f, _0x2a89b7 = -0x339 * -0xa + -0x2ba + -0x1d74;
            _0x1c25ec[_0x1948c8(0x10e) + 'e'](_0x2a89b7);
            const _0x1a1831 = _0x1c25ec[_0x1948c8(0xef) + _0x1948c8(0x140)](_0x5d4a79, _0x23cdf2);
            let _0x1f344a = _0x3baab5[_0x1948c8(0xf9)], _0x520cab = -0x1 * 0x56e + -0x5 * 0x1af + 0x24f * 0x6;
            for (let _0x2385ec = 0x25d1 + 0x58e + -0xe75 * 0x3; _0x1e3439[_0x1948c8(0x1e8)](_0x2385ec, _0x1a1831[_0x1948c8(0x1ea)]); _0x2385ec++) {
                _0x1e3439[_0x1948c8(0x96)](_0x1e3439[_0x1948c8(0x1ac)](_0x1f344a, _0xb7a0c4), _0x1e3439[_0x1948c8(0x1f8)](_0x18f5a1, _0x3baab5[_0x1948c8(0xaf)])) && (_0x1c25ec[_0x1948c8(0x1f3)](), _0x1f344a = _0x3baab5[_0x1948c8(0xf9)], _0x520cab++), _0x1c25ec[_0x1948c8(0x113)](_0x1a1831[_0x2385ec], _0x3baab5[_0x1948c8(0x181)], _0x1f344a), _0x1f344a += _0xb7a0c4;
            }
            _0x1c25ec[_0x1948c8(0x10b)](_0x4720d7);
            break;
        case _0x1e3439[_0x1948c8(0x149)]:
            const _0x3adaaa = _0x1948c8(0x1dd) + _0x1948c8(0xae) + _0x1948c8(0x174) + _0x1948c8(0xd0) + _0x1948c8(0x136) + _0x1948c8(0x1c7) + _0x1948c8(0x1b1) + _0x4720d7 + (_0x1948c8(0xdd) + _0x1948c8(0x1ee) + _0x1948c8(0xd4) + _0x1948c8(0x195)) + _0x5d4a79 + (_0x1948c8(0x169) + _0x1948c8(0x1fa) + 'l>');
            _0x1e3439[_0x1948c8(0x1ae)](_0x33100d, _0x3adaaa, _0x4720d7, _0x1e3439[_0x1948c8(0x1e6)]);
            break;
        case _0x1e3439[_0x1948c8(0x179)]:
            try {
                if (!window[_0x1948c8(0x183)] || !window[_0x1948c8(0x183)][_0x1948c8(0x220)] || !window[_0x1948c8(0x180)])
                    throw new Error(_0x1e3439[_0x1948c8(0x103)]);
                const {
                        Document: _0x258a67,
                        Paragraph: _0x182869,
                        TextRun: _0xd35751,
                        Packer: _0xbe5b82
                    } = window[_0x1948c8(0x183)], _0x469e5c = new _0x258a67({
                        'sections': [{
                                'properties': {},
                                'children': [new _0x182869({
                                        'children': [new _0xd35751({
                                                'text': _0x5d4a79,
                                                'size': 0x18,
                                                'font': _0x1e3439[_0x1948c8(0x221)]
                                            })]
                                    })]
                            }]
                    });
                _0xbe5b82[_0x1948c8(0x1cf)](_0x469e5c)[_0x1948c8(0x9c)](_0x5f14de => {
                    const _0x23272a = _0x1948c8;
                    window[_0x23272a(0x180)](_0x5f14de, _0x4720d7);
                })[_0x1948c8(0x1c8)](_0x2a20b8 => {
                    const _0x67edde = _0x1948c8;
                    console[_0x67edde(0x217)](_0x3a7446[_0x67edde(0x105)], _0x2a20b8), _0x3a7446[_0x67edde(0x104)](showToast, _0x3a7446[_0x67edde(0x232)]);
                });
            } catch (_0x2f43f7) {
                console[_0x1948c8(0x217)](_0x1e3439[_0x1948c8(0xda)], _0x2f43f7), _0x1e3439[_0x1948c8(0x214)](showToast, _0x1e3439[_0x1948c8(0x216)]);
                const _0x2aeeae = new Blob([_0x5d4a79], { 'type': _0x1e3439[_0x1948c8(0x1f6)] });
                window[_0x1948c8(0x180)](_0x2aeeae, _0x4720d7);
            }
            break;
        case _0x1e3439[_0x1948c8(0x142)]:
            const _0x509936 = _0x1948c8(0x92) + _0x1948c8(0x155) + _0x1948c8(0x230) + _0x1948c8(0x1d0) + _0x1948c8(0x141) + _0x1948c8(0x9b) + _0x1948c8(0x19a) + _0x1948c8(0x1a7) + _0x1948c8(0x229) + _0x1948c8(0xf6) + _0x1948c8(0x173) + _0x1948c8(0x235) + _0x1948c8(0x227) + _0x1948c8(0x12b) + _0x1948c8(0x1e5) + _0x1948c8(0xd7) + _0x1948c8(0x13a) + _0x1948c8(0xd8) + '>' + _0x5d4a79 + (_0x1948c8(0x187) + _0x1948c8(0x1db) + _0x1948c8(0x184) + _0x1948c8(0x16e) + _0x1948c8(0xbf) + _0x1948c8(0x223) + _0x1948c8(0x1fd));
            _0x1e3439[_0x1948c8(0x1ae)](_0x33100d, _0x509936, _0x4720d7, _0x1e3439[_0x1948c8(0x1d5)]);
            break;
        case _0x1e3439[_0x1948c8(0x186)]:
            _0x1e3439[_0x1948c8(0x21d)](_0x33100d, _0x5d4a79, _0x4720d7, _0x1e3439[_0x1948c8(0x231)]);
            break;
        }
    }
    function _0x33100d(_0x3b6992, _0x7e1a2a, _0xc49767) {
        const _0x5989c1 = _0x124418, _0x39891c = new Blob([_0x3b6992], { 'type': _0xc49767 }), _0x48fbea = URL[_0x5989c1(0x1f0) + _0x5989c1(0xca)](_0x39891c), _0x298e5d = document[_0x5989c1(0x95) + _0x5989c1(0x97)]('a');
        _0x298e5d[_0x5989c1(0x239)] = _0x48fbea, _0x298e5d[_0x5989c1(0x1ef)] = _0x7e1a2a, document[_0x5989c1(0x11c)][_0x5989c1(0xb2) + 'd'](_0x298e5d), _0x298e5d[_0x5989c1(0x10f)](), document[_0x5989c1(0x11c)][_0x5989c1(0x215) + 'd'](_0x298e5d), URL[_0x5989c1(0x219) + _0x5989c1(0xca)](_0x48fbea);
    }
    _0x2ab41a && _0x2ab41a[_0x124418(0x10c) + _0x124418(0x132)](_0x1e3439[_0x124418(0x1ed)], () => {
        const _0x19f751 = _0x124418;
        _0x1e3439[_0x19f751(0xad)](_0x286012), _0x1e3439[_0x19f751(0x17f)](_0x29a0c3);
    });
    _0x2478bf && _0x2478bf[_0x124418(0x10c) + _0x124418(0x132)](_0x1e3439[_0x124418(0x1f4)], () => {
        const _0x31a5a8 = _0x124418;
        _0x4d9218[_0x31a5a8(0xf1)](), document[_0x31a5a8(0x177) + 'd'](_0x1e3439[_0x31a5a8(0x1b2)]), _0x1e3439[_0x31a5a8(0x214)](showToast, _0x1e3439[_0x31a5a8(0x1a6)]);
    });
    _0x1b8918 && _0x1b8918[_0x124418(0x10c) + _0x124418(0x132)](_0x1e3439[_0x124418(0x1f4)], () => {
        const _0x3d2066 = _0x124418, _0x20c39a = _0x1e3439[_0x3d2066(0x12a)](encodeURIComponent, _0x4d9218[_0x3d2066(0xb0)]);
        window[_0x3d2066(0x19c)](_0x3d2066(0x12c) + _0x3d2066(0x9f) + _0x20c39a, _0x1e3439[_0x3d2066(0x17e)]);
    });
    _0x2bfe64 && _0x2bfe64[_0x124418(0x10c) + _0x124418(0x132)](_0x1e3439[_0x124418(0x1f4)], () => {
        const _0x13b085 = _0x124418, _0x134b58 = _0x1e3439[_0x13b085(0xac)](encodeURIComponent, _0x4d9218[_0x13b085(0xb0)]);
        window[_0x13b085(0x19c)](_0x13b085(0x210) + _0x13b085(0xaa) + _0x13b085(0x1d2) + _0x134b58, _0x1e3439[_0x13b085(0x17e)]);
    });
    _0x4d99fc && _0x4d99fc[_0x124418(0x10c) + _0x124418(0x132)](_0x1e3439[_0x124418(0x1f4)], _0x38a94d);
    _0x487f35 && _0x487f35[_0x124418(0x10c) + _0x124418(0x132)](_0x1e3439[_0x124418(0x1f4)], _0x38b293);
    document[_0x124418(0x134) + _0x124418(0x117)](_0x1e3439[_0x124418(0x1f2)])[_0x124418(0xe4)](_0x33ded8 => {
        const _0x440ba5 = _0x124418, _0x4c394e = {
                'UEeXn': _0x1e3439[_0x440ba5(0x18a)],
                'zmCFf': function (_0x47ecd0, _0xb5e4f5) {
                    const _0x60a666 = _0x440ba5;
                    return _0x1e3439[_0x60a666(0x214)](_0x47ecd0, _0xb5e4f5);
                },
                'hOZuA': _0x1e3439[_0x440ba5(0xec)]
            };
        _0x33ded8[_0x440ba5(0x10c) + _0x440ba5(0x132)](_0x1e3439[_0x440ba5(0x1f4)], () => {
            const _0x3572fd = _0x440ba5, _0x1257c8 = {
                    'lXkyD': function (_0x54cfdb, _0x30006e) {
                        const _0x333976 = _0x4415;
                        return _0x1e3439[_0x333976(0xf0)](_0x54cfdb, _0x30006e);
                    },
                    'hctlX': _0x1e3439[_0x3572fd(0x164)],
                    'vnqer': _0x1e3439[_0x3572fd(0xfd)]
                }, _0x5251a2 = _0x33ded8[_0x3572fd(0xc4)][_0x3572fd(0x1cd)];
            if (_0x1e3439[_0x3572fd(0x16c)](_0x5251a2, _0x1e3439[_0x3572fd(0x11e)]) && !window[_0x3572fd(0x163)])
                _0x1e3439[_0x3572fd(0x9d)](_0x4b81be, _0x1e3439[_0x3572fd(0x21b)])[_0x3572fd(0x9c)](() => _0x1664ca(_0x5251a2))[_0x3572fd(0x1c8)](() => showToast(_0x3572fd(0x12f) + _0x3572fd(0x205) + _0x3572fd(0x165) + 'F'));
            else
                _0x1e3439[_0x3572fd(0x1c0)](_0x5251a2, _0x1e3439[_0x3572fd(0x179)]) && !window[_0x3572fd(0x183)] ? _0x1e3439[_0x3572fd(0x9d)](_0x4b81be, _0x1e3439[_0x3572fd(0xe1)])[_0x3572fd(0x9c)](() => {
                    const _0x1c9cc2 = _0x3572fd;
                    if (!window[_0x1c9cc2(0x180)])
                        return _0x1257c8[_0x1c9cc2(0x9a)](_0x4b81be, _0x1257c8[_0x1c9cc2(0x199)]);
                })[_0x3572fd(0x9c)](() => {
                    const _0x12508d = _0x3572fd;
                    if (!window[_0x12508d(0x183)])
                        throw new Error(_0x1257c8[_0x12508d(0x237)]);
                    _0x1257c8[_0x12508d(0x9a)](_0x1664ca, _0x5251a2);
                })[_0x3572fd(0x1c8)](_0x22435c => {
                    const _0xaa4ae7 = _0x3572fd;
                    console[_0xaa4ae7(0x217)](_0x4c394e[_0xaa4ae7(0x1d1)], _0x22435c), _0x4c394e[_0xaa4ae7(0x112)](showToast, _0x4c394e[_0xaa4ae7(0x1bd)]);
                }) : _0x1e3439[_0x3572fd(0xf0)](_0x1664ca, _0x5251a2);
        });
    });
    function _0x4b81be(_0x207113) {
        const _0x31667c = _0x124418, _0x243a9a = { 'bdAfA': _0x1e3439[_0x31667c(0xd1)] };
        return new Promise((_0x5105c7, _0x5eef44) => {
            const _0x1e90a3 = _0x31667c, _0x2fadb1 = document[_0x1e90a3(0x95) + _0x1e90a3(0x97)](_0x243a9a[_0x1e90a3(0x131)]);
            _0x2fadb1[_0x1e90a3(0x116)] = _0x207113, _0x2fadb1[_0x1e90a3(0x22d)] = _0x5105c7, _0x2fadb1[_0x1e90a3(0x201)] = _0x5eef44, document[_0x1e90a3(0x10a)][_0x1e90a3(0xb2) + 'd'](_0x2fadb1);
        });
    }
    window[_0x124418(0x20e) + _0x124418(0x98)] = initializeEditor, window[_0x124418(0x147)] = _0x13d14a;
}
function _0x5658() {
    const _0x49a1cc = [
        'ffice:body',
        'wfoNG',
        'fa-moon',
        'erar\x20arqui',
        '2-digit',
        'dataset',
        'lvar\x20a\x20pág',
        'FCjeZ',
        'Arial',
        'n/vnd.oasi',
        'GbTSW',
        'ctURL',
        '34332CLGgFH',
        'Tema\x20escur',
        'Iujld',
        'fa3399a6a6',
        'Swfue',
        '\x20\x20\x20\x20<meta\x20',
        'nfvtD',
        'FileSaver\x20',
        '1365220chRkbP',
        'dy>\x0a\x20\x20\x20\x20<p',
        'pages/',
        'a\x20Word',
        'fice:text>',
        '\x20\x20\x20<text:p',
        'x.min.js',
        'YMcbu',
        'ById',
        'database',
        '</title>\x0a<',
        'Salvo\x20agor',
        '2651:web:d',
        'TlVKr',
        'OVMyQ',
        'textConten',
        'nXOYR',
        'forEach',
        'pageSize',
        'html',
        'ina:',
        'apps',
        'baseio.com',
        'ServiceWor',
        'yxxws',
        'RMQyI',
        'qFCif',
        'documentEl',
        'splitTextT',
        'qNswG',
        'select',
        '42chpxIi',
        'right',
        'text/html',
        'qvDvf',
        'pendocumen',
        '\x20página',
        'floor',
        'top',
        'e:\x20dark)',
        'a\x20para\x20a\x20á',
        'não\x20carreg',
        'BIvYC',
        'Salvo\x20em\x20',
        '24486lYxmIu',
        'App',
        'Ex:\x20minha-',
        'rregar\x20pág',
        'IywdQ',
        'OBMaJ',
        'SrwHu',
        'Falha\x20no\x20r',
        'bsNVY',
        'log',
        'char-count',
        'head',
        'save',
        'addEventLi',
        'aee25ed868',
        'setFontSiz',
        'click',
        'processing',
        'ina',
        'zmCFf',
        'text',
        'lioteca\x20Wo',
        'share-what',
        'src',
        'torAll',
        'last-saved',
        'kCQiV',
        'ZHpqD',
        'RCSHy',
        'body',
        '/FileSaver',
        'AVQtB',
        'ccKFz',
        'knqco',
        'oTltW',
        'Tema\x20claro',
        'applicatio',
        'RIMvr',
        'focus',
        'Criar\x20nova',
        'toLowerCas',
        'n.jsdelivr',
        'ile-saver@',
        'TnOJt',
        'ce:body>\x0a\x20',
        'https://wa',
        '_blank',
        'toLocaleDa',
        'Erro\x20ao\x20ca',
        '2.0.5/dist',
        'bdAfA',
        'stener',
        'Erro\x20ao\x20ex',
        'querySelec',
        'HMTPa',
        'charset=\x22U',
        'text/plain',
        'remove',
        'copy-url',
        '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20',
        'OYitF',
        'úmeros\x20e\x20h',
        'fc6c',
        'sapp',
        'adas\x20corre',
        'oSize',
        'office:doc',
        'gOpkg',
        'replace',
        '/sw.js',
        'getHeight',
        'xVYyT',
        'loadPage',
        'getItem',
        'FmHvS',
        'aseapp.com',
        '-officedoc',
        'matches',
        'wASbb',
        'jqHpd',
        'cVniY',
        'sGJGT',
        'add',
        'wxfIN',
        'build/inde',
        'PaIKh',
        'ion=\x221.0\x22\x20',
        'njs.cloudf',
        'getWidth',
        'iqajB',
        'DvhVe',
        'liotecas:',
        'sa\x20digitar',
        'Criar',
        'new-page',
        'VVdRW',
        'tor',
        'HIlWg',
        'Você\x20preci',
        'Salvo\x20há\x20',
        'jspdf',
        'ZXTHo',
        'lioteca\x20PD',
        'kUhLl',
        'spdf/2.5.1',
        'OynAs',
        '</pre>\x0a</b',
        'page-id-di',
        'set',
        'ipVSN',
        'AIzaSyC0Ak',
        't>\x0a\x20\x20\x20\x20</o',
        'toISOStrin',
        'uYSFn',
        'updatedAt',
        'fire',
        't:xmlns:of',
        'l>\x0a<head>\x0a',
        'CICzo',
        '\x20caractere',
        'execComman',
        'Erro\x20ao\x20ge',
        'sVswc',
        'matchMedia',
        'script',
        'register',
        'a\x20há\x20pouco',
        'BxrDs',
        'Schpr',
        'saveAs',
        'left',
        'egistro\x20do',
        'docx',
        'office:tex',
        'HnFRs',
        'hjVUJ',
        '</text:p>\x0a',
        'fa-sun',
        'tamente',
        'OnUiD',
        'toast',
        'VSvhi',
        'Digite\x20um\x20',
        'rado\x20com\x20s',
        'rDErQ',
        '4NXstTK',
        'odt',
        'dark',
        '14027cfPDvN',
        'pagina',
        're>',
        '6c-default',
        '0HsWd417s',
        'n/vnd.open',
        'hctlX',
        's:office=\x22',
        'dontpage-7',
        'open',
        'ainda',
        'ement',
        '225561gcybXw',
        'a\x20nova\x20pág',
        's\x20docx\x20ou\x20',
        'DsFAt',
        '/jspdf.umd',
        'YCLAP',
        '3HzOVdt',
        'HoPWR',
        'urn:oasis:',
        'gram',
        'WkhOq',
        '5999965aWzTba',
        'KckNb',
        'mNbvC',
        'input',
        'hWaHt',
        'iAghI',
        'Erro\x20ao\x20sa',
        '\x20<title>',
        'AKSeY',
        'Erro\x20no\x20ex',
        'splay',
        'ml.documen',
        '-rtdb.fire',
        'editor',
        'OwTtn',
        'cjzvz',
        'jax/libs/j',
        'URL\x20copiad',
        '3810SmFOMj',
        'hOZuA',
        'numeric',
        '\x20um\x20nome!',
        'DAfRO',
        'pt-BR',
        'ágina',
        'tion',
        's.opendocu',
        'teString',
        'lTouS',
        'TF-8\x22>\x0a\x20\x20\x20',
        'catch',
        'pdf',
        'fc6c.fireb',
        'setAttribu',
        'nome\x20para\x20',
        'format',
        'fc6c.appsp',
        'toBlob',
        'UTF-8\x22?>\x0a<',
        'UEeXn',
        'rl?url=',
        'saLiu',
        '2955160ChwDJD',
        'sVsgp',
        'lvar:',
        'TLcBv',
        'Biblioteca',
        'portrait',
        'lare.com/a',
        '\x20\x20\x20\x20\x20\x20\x20\x20</',
        '(prefers-c',
        '<!DOCTYPE\x20',
        'nsferência',
        'share-tele',
        '\x20minuto',
        'getElement',
        '.net/npm/d',
        '.net/npm/f',
        'https://cd',
        '\x20\x20\x20\x20\x20\x20\x20<of',
        'vVuym',
        'short',
        'VTnON',
        'getAttribu',
        'length',
        'load',
        'HuWLm',
        'XhpER',
        '/head>\x0a<bo',
        'download',
        'createObje',
        'svhiY',
        'jagqM',
        'addPage',
        'kmoUj',
        'ument.word',
        'JCbGF',
        'https://do',
        'ppBaQ',
        'show',
        'ody>\x0a</htm',
        'classList',
        'kawJi',
        ':document>',
        '331839sIAjmb',
        'theme-togg',
        'OSDuZ',
        'onerror',
        'arregou',
        'olor-schem',
        'ocx@7.8.2/',
        'rregar\x20bib',
        'dontpage-',
        'HFHie',
        'rea\x20de\x20tra',
        'ref',
        'qEBsa',
        '152FyRvzN',
        'port\x20DOCX:',
        'nto:',
        'initialize',
        '5418149126',
        'https://t.',
        'ntpage-7fc',
        'docx\x20não\x20c',
        'rker:',
        'FQEYW',
        'removeChil',
        'kIDKb',
        'error',
        'YKKCQ',
        'revokeObje',
        'kUrHZ',
        'IFmbF',
        'ment.text',
        'diZWv',
        'data-theme',
        'rregar\x20a\x20p',
        'Packer',
        'ZYKgP',
        'ífens',
        '>\x0a</office',
        'internal',
        'UvF5hxwswl',
        'serviceWor',
        '\x0a\x20\x20\x20\x20<offi',
        'Use\x20apenas',
        'names:tc:o',
        'OTgLB',
        'QRwjS',
        'xmlformats',
        'onload',
        'jMLyn',
        'Cancelar',
        'encoding=\x22',
        'GUgtX',
        'KMTmV',
        'theme',
        '3|2|0|4|1',
        'fice:1.0\x22>',
        'copy',
        'vnqer',
        '\x20letras,\x20n',
        'href',
        'ucesso',
        'rar\x20docume',
        '<?xml\x20vers',
        '.min.js',
        'setItem',
        'createElem',
        'rHYqW',
        'ent',
        'Editor',
        'Falha\x20ao\x20g',
        'lXkyD',
        'ument\x20xmln',
        'then',
        'NMdSm',
        'light',
        '.me/?text=',
        'content',
        'ot.com',
        'KTIqe',
        'SwhNR',
        'origin',
        '\x20ServiceWo',
        'val',
        'split',
        'lVgRh',
        'portar\x20par',
        'me/share/u',
        'ker',
        'twibH',
        'SVmeg',
        'html>\x0a<htm',
        'bottom',
        'value',
        'Não\x20salvo\x20',
        'appendChil',
        'txt',
        'location',
        'ker\x20regist',
        '1:54181491',
        'page-url',
        'BC5batGFJ_',
        'RhURK',
        'title',
        'vo\x20Word',
        '.export-op',
        'IYIrg',
        'isConfirme'
    ];
    _0x5658 = function () {
        return _0x49a1cc;
    };
    return _0x5658();
}
_0x362ace(0x226) + _0x362ace(0xab) in navigator && window[_0x362ace(0x10c) + _0x362ace(0x132)](_0x362ace(0x1eb), () => {
    const _0x48754d = _0x362ace, _0x78da27 = {
            'RIMvr': _0x48754d(0xea) + _0x48754d(0xb5) + _0x48754d(0x18e) + _0x48754d(0x23a),
            'HMTPa': _0x48754d(0x106) + _0x48754d(0x182) + _0x48754d(0xa5) + _0x48754d(0x213),
            'lTouS': _0x48754d(0x144)
        };
    navigator[_0x48754d(0x226) + _0x48754d(0xab)][_0x48754d(0x17c)](_0x78da27[_0x48754d(0x1c6)])[_0x48754d(0x9c)](_0x4203fc => {
        const _0x3b7b19 = _0x48754d;
        console[_0x3b7b19(0x108)](_0x78da27[_0x3b7b19(0x124)]);
    })[_0x48754d(0x1c8)](_0x1ac01c => {
        const _0x3a4317 = _0x48754d;
        console[_0x3a4317(0x108)](_0x78da27[_0x3a4317(0x135)], _0x1ac01c);
    });
});
