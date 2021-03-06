// options.js

function initOptions () {
    $('#replacement option').each( function (i) {
        var fontName = $(this).val();
        if (!$(this).hasClass('embeddable')
            && !$(this).hasClass('custom')
            && !isFontInstalled( fontName )) {
            $(this).attr('disabled', 'disabled');
            $('#warnings')
                .html('Some font options may be unavailable in your system.')
                .show();
            // $(this).remove();
        }
    } );
    
    var options = JSON.parse( localStorage.mypersianfonts );
    
    $('#replacement option').filter('[value="' + options.replacement + '"]').attr('selected', true);

    $('#replace_bbcnassim')
        .attr('checked', options.replaceBBCNassim);
        
    $('#replace_arial')
        .attr('checked', options.replaceArial);
        
    $('#replace_times_new_roman')
        .attr('checked', options.replaceTimesNewRoman);
        
    $('#replace_tahoma')
        .attr('checked', options.replaceTahoma);
    
    $('#optimize_legibility')
        .attr('checked', options.optimizeLegibility);

    $('#replacement_custom').val(options.replacementCustom);
    
    if ($('#replacement option:selected').hasClass('custom')) {
        $('#preview').show();
        $('#replacement-advanced').show();
        checkFont(true);
    } else {
        $('#preview').hide();
        $('#replacement-advanced').hide();
    }
}

function saveOptions () {
    var options = {};
    
    // custom replacement font
    var customReplacementFont = $('#replacement_custom').val();
    var customFontInstalled = isFontInstalled( customReplacementFont, false );
    
    if ($('#replacement option:selected').hasClass('custom')) {
        $('#replacement-advanced').slideDown('fast');
        checkFont(true);
    } else {
        $('#replacement-advanced').slideUp('fast');
        $('#preview').slideUp('fast');
        $('#warnings').slideUp('fast');
    }
    
    if (customReplacementFont && customFontInstalled) {
        options.replacementCustom = customReplacementFont;
        options.replacementCustomValid = true;
        
    } else if (customReplacementFont) {
        // Invalid
        var previous = JSON.parse( localStorage.mypersianfonts );
        options.replacementCustom = previous.replacementCustom;
        options.replacementCustomValid = true;

    } else {
        options.replacementCustom = '';
        options.replacementCustomValid = false;
    }

    options.replaceBBCNassim
        = $('#replace_bbcnassim:checked').val() != null;
    
    options.replaceArial
        = $('#replace_arial:checked').val() != null;

    options.replaceTimesNewRoman
        = $('#replace_times_new_roman:checked').val() != null;

    options.replaceTahoma
        = $('#replace_tahoma:checked').val() != null;
    
    options.replacement
        = $('#replacement option:selected').val();
    
    options.optimizeLegibility
        = $('#optimize_legibility:checked').val() != null;
    
    localStorage.mypersianfonts = JSON.stringify( options );
}

function checkFont (saving) {
    var fontName = $('#replacement_custom').val();
    
    var customFontInstalled = (fontName) ? isFontInstalled( fontName, false ) : false;
    
    if (customFontInstalled) {
        $('#replacement_custom').removeClass('notfound');
        if (saving) {
            $('#warnings').slideUp('fast');
            $('#custom-font-sample').css('font-family', fontName);
            $('#preview').slideDown('fast');
        }
        
    } else {
        $('#replacement_custom').addClass('notfound');
        if (saving) {
            var warningMsg = (fontName)
                ? 'The custom font you specified is not available.'
                : 'You must specify a custom font.';
            $('#warnings').html(warningMsg).slideDown('fast');
            $('#preview').slideUp('fast');
        }
    }
}

function isFontInstalled (font, monospace) {
    var targetString = '~mwMW';
    var targetFamily = (monospace) ? 'sans-serif' : 'monospace, monospace';
    // Why monospace twice? It's a bug in the rendering engine:
    // http://www.undermyhat.org/blog/2009/09/css-font-family-monospace-renders-inconsistently-in-firefox-and-chrome/
    
    $('body').append('<div id="fontTest"></div>');

    $('#fontTest').append('<span id="ftTarget">' + targetString + '</div>');
    $('#fontTest').append('<span id="ftMatch">' + targetString + '</div>');
    
    $('#ftTarget').css('font-family', targetFamily);
    $('#ftMatch').css('font-family', font + ',' + targetFamily);

    var targetW = $('#ftTarget').width();
    var targetH = $('#ftTarget').height();
    
    var matchW  = $('#ftMatch').width();
    var matchH  = $('#ftMatch').height();
    
    $('#fontTest').remove();

    return (targetW != matchW || targetH != matchH);
}


