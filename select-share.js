// select-share.js

jQuery(document).ready(function($) {
    var iconPath = selectShareData.pluginUrl + 'icons/' + selectShareData.colorChoice + '/';

    var shareButtonsHtml = `
        <div class="share-buttons `+ selectShareData.colorChoice +`">
            <a href="#" class="share-twitter" title="Share snippet to Twitter"><img src="` + iconPath + `twitter.svg" alt="Twitter"></a>
            <a href="#" class="share-facebook" title="Share snippet to Facebook"><img src="` + iconPath + `facebook.svg" alt="Facebook"></a>
            <a href="#" class="share-linkedin" title="Share snippet to Linkedin"><img src="` + iconPath + `linkedin.svg" alt="LinkedIn"></a>
            <a href="#" class="share-whatsapp" title="Share snippet to WhatsApp"><img src="` + iconPath + `whatsapp.svg" alt="WhatsApp"></a>
            <a href="#" class="share-telegram" title="Share snippet to Telegram"><img src="` + iconPath + `telegram.svg" alt="Telegram"></a>
        </div>
    `;
    $('body').append(shareButtonsHtml);

    function getSelectedText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    function getSelectionCoords() {
        var sel = window.getSelection();
        if (!sel.rangeCount) return { x: 0, y: 0 };

        var range = sel.getRangeAt(0).cloneRange();
        var rect = range.getBoundingClientRect();
        return { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
    }

    $(document).on('mouseup', function(e) {
        var selectedText = getSelectedText();
        if (selectedText) {
            var coords = getSelectionCoords();
            $('.share-buttons').css({
                top: coords.y - $('.share-buttons').outerHeight() - 10, // Place buttons above the selection
                left: coords.x
            }).fadeIn(200);
        } else {
            $('.share-buttons').fadeOut(200);
        }
    });

    $(document).on('mousedown', function(e) {
        if (!$(e.target).closest('.share-buttons').length) {
            $('.share-buttons').fadeOut(200);
        }
    });

    function getQuotedText() {
        var text = getSelectedText();
        return '"' + text + '"\n\n';
    }

    $(document).on('click', '.share-twitter', function(e) {
        e.preventDefault();
        var quotedText = getQuotedText();
        var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(quotedText) + '&url=' + encodeURIComponent(window.location.href);
        window.open(url, '_blank');
    });

    $(document).on('click', '.share-facebook', function(e) {
        e.preventDefault();
        var quotedText = getQuotedText();
        var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) + '&quote=' + encodeURIComponent(quotedText);
        window.open(url, '_blank');
    });

    $(document).on('click', '.share-linkedin', function(e) {
        e.preventDefault();
        var quotedText = getQuotedText();
        var url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(quotedText);
        window.open(url, '_blank');
    });

    $(document).on('click', '.share-whatsapp', function(e) {
        e.preventDefault();
        var quotedText = getQuotedText();
        var url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(quotedText + ' ' + window.location.href);
        window.open(url, '_blank');
    });

    $(document).on('click', '.share-telegram', function(e) {
        e.preventDefault();
        var quotedText = getQuotedText();
        var url = 'https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(quotedText);
        window.open(url, '_blank');
    });
});