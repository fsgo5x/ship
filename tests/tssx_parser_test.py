import tssx.parser
import lxml.html

XML_TABLE = lxml.html.fromstring(
    """\
<tr>
    <td class="coll-1 name">
        <a href="/sub/games/PC Game/1/" class="icon">
            <i class="flaticon-apps"></i></a><a href="/torrent/4367203/DOOM-Eternal-CODEX/">DOOM.Eternal-CODEX</a></td>
    <td class="coll-2 seeds">107</td>
    <td class="coll-3 leeches">123</td>
    <td class="coll-date">Mar. 30th '20</td>
    <td class="coll-4 size mob-uploader">38.8 GB</td>
    <td class="coll-5 uploader"><a href="/user/SirMadMax/">SirMadMax</a>
    </td>
</tr>
            """)

VALID_TORRENT_INFO = {
    'name': 'DOOM.Eternal-CODEX',
    'relative link': '/torrent/4367203/DOOM-Eternal-CODEX/',
    'seeds': '107',
    'leeches': '123',
    'date created': 'Mar. 30th \'20',
    'size': '38.8 GB',
    'uploader': 'SirMadMax'
}


def test_has_valid_info_type_returns_true_on_all_string_values():
    assert tssx.parser.has_valid_info_value_type(VALID_TORRENT_INFO)


def test_has_valid_info_keys_returns_true_on_valid_keys():
    assert tssx.parser.has_valid_info_keys(VALID_TORRENT_INFO)


def test_parse_from_tssx_tr_tag_returns_valid_torrent_info():
    function_result = tssx.parser.from_tssx_tr_tag(XML_TABLE)
    assert list(function_result.keys()) == list(VALID_TORRENT_INFO.keys())
    assert list(function_result.values()) == list(VALID_TORRENT_INFO.values())
