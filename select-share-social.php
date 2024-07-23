<?php
/*
Plugin Name: Select Share Social
Description: Displays share buttons after text selection for sharing on Twitter, Facebook, LinkedIn, WhatsApp, and Telegram.
Version: 1.0
Author: Laman7 - B2B Marketing Agency
Author URI: https://laman7.com/
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.txt
Text Domain: select-share-social
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

function select_share_social_enqueue_scripts() {
    if (is_singular(get_option('select_share_social_post_types', array('post', 'page')))) {
        // Define the version number
        $plugin_version = '1.0'; // You can also use a dynamic version like filemtime(__FILE__)

        wp_enqueue_style('select-share-social-css', plugin_dir_url(__FILE__) . 'select-share.css', array(), $plugin_version);
        wp_enqueue_script('select-share-social-js', plugin_dir_url(__FILE__) . 'select-share.js', array('jquery'), $plugin_version, true);

        // Pass plugin URL and color choice to JS
        $color_choice = get_option('select_share_social_color_choice', 'black');
        wp_localize_script('select-share-social-js', 'selectShareData', array(
            'pluginUrl' => plugin_dir_url(__FILE__),
            'colorChoice' => $color_choice
        ));
    }
}
add_action('wp_enqueue_scripts', 'select_share_social_enqueue_scripts');


// Add settings menu
function select_share_social_settings_menu() {
    add_options_page(
        'Select Share Social Settings',
        'Select Share Social',
        'manage_options',
        'select-share-social',
        'select_share_social_settings_page'
    );
}
add_action('admin_menu', 'select_share_social_settings_menu');

// Settings page content
function select_share_social_settings_page() {
    ?>
    <div class="wrap">
        <h1>Select Share Social Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('select_share_social_settings_group');
            do_settings_sections('select-share-social');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings
function select_share_social_register_settings() {
    register_setting('select_share_social_settings_group', 'select_share_social_color_choice');
    register_setting('select_share_social_settings_group', 'select_share_social_post_types');

    add_settings_section('select_share_social_settings_section', 'Icon Color', null, 'select-share-social');
    add_settings_field('select_share_social_color_choice', 'Choose Icon Color', 'select_share_social_color_choice_callback', 'select-share-social', 'select_share_social_settings_section');

    add_settings_section('select_share_social_post_types_section', 'Post Types', null, 'select-share-social');
    add_settings_field('select_share_social_post_types', 'Select Post Types', 'select_share_social_post_types_callback', 'select-share-social', 'select_share_social_post_types_section');
}
add_action('admin_init', 'select_share_social_register_settings');

// Settings field callback for icon color
function select_share_social_color_choice_callback() {
    $color_choice = get_option('select_share_social_color_choice', 'black');
    ?>
    <select name="select_share_social_color_choice">
        <option value="black" <?php selected($color_choice, 'black'); ?>>Black</option>
        <option value="white" <?php selected($color_choice, 'white'); ?>>White</option>
    </select>
    <?php
}

// Settings field callback for post types
function select_share_social_post_types_callback() {
    $post_types = get_post_types(array('public' => true), 'objects');
    $selected_post_types = get_option('select_share_social_post_types', array('post', 'page'));
    foreach ($post_types as $post_type) {
        ?>
        <input type="checkbox" name="select_share_social_post_types[]" value="<?php echo esc_attr($post_type->name); ?>" <?php checked(in_array($post_type->name, $selected_post_types)); ?>>
        <?php echo esc_html($post_type->label); ?><br>
        <?php
    }
}