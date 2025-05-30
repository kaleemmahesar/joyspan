<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
	/**
	 * Adds theme support for post formats.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_post_format_setup() {
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_editor_style() {
		add_editor_style( get_parent_theme_file_uri( 'assets/css/editor-style.css' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues style.css on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
	/**
	 * Enqueues style.css on the front.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_styles() {
		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri( 'style.css' ),
			array(),
			wp_get_theme()->get( 'Version' )
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
	/**
	 * Registers custom block styles.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_block_styles() {
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
	/**
	 * Registers pattern categories.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_pattern_categories() {

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => __( 'Pages', 'twentytwentyfive' ),
				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => __( 'Post formats', 'twentytwentyfive' ),
				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
	/**
	 * Registers the post format block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_block_bindings() {
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
	/**
	 * Callback function for the post format name block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return string|void Post format name, or nothing if the format is 'standard'.
	 */
	function twentytwentyfive_format_binding() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;

// Register menu endpoints
function register_menu_endpoints() {
    register_rest_route('wp/v2', '/menus', array(
        'methods' => 'GET',
        'callback' => 'get_menus',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('wp/v2', '/menu-items', array(
        'methods' => 'GET',
        'callback' => 'get_menu_items',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'register_menu_endpoints');

// Get all menus
function get_menus() {
    $menus = wp_get_nav_menus();
    $data = array();
    
    foreach ($menus as $menu) {
        $data[] = array(
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug
        );
    }
    
    return $data;
}

// Get menu items
function get_menu_items($request) {
    $menu_id = $request->get_param('menus');
    $menu_items = wp_get_nav_menu_items($menu_id);
    $data = array();
    
    foreach ($menu_items as $item) {
        $data[] = array(
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'parent' => $item->menu_item_parent,
            'order' => $item->menu_order
        );
    }
    
    return $data;
} 

function register_my_menus() {
  register_nav_menus(
    array(
      'header-menu' => __( 'Header Menu' ),
      'footer-menu' => __( 'Footer Menu' )
    )
  );
}
add_action( 'init', 'register_my_menus' );

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: http://localhost:5173');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        return $value;
    });
}, 15);

// Allow public user registration via REST API
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in() && $_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/wp-json/wp/v2/users') {
        return true;
    }
    return $result;
});

// Allow public access to user registration endpoint
add_filter('rest_endpoints', function($endpoints) {
    if (isset($endpoints['/wp/v2/users'])) {
        $endpoints['/wp/v2/users'][0]['methods'] = 'POST';
        $endpoints['/wp/v2/users'][0]['permission_callback'] = '__return_true';
    }
    return $endpoints;
});

add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in() && $_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/wp-json/wp/v2/users') {
        return true;
    }
    return $result;
});

// Enable JWT Authentication
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in() && $_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/wp-json/jwt-auth/v1/token') {
        return true;
    }
    return $result;
});


// Enable JWT Authentication
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in() && $_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/wp-json/wp/v2/users') {
        return true;
    }
    return $result;
});

// Add JWT Authentication endpoints
add_action('rest_api_init', function () {
    register_rest_route('jwt-auth/v1', '/token', array(
        'methods' => 'POST',
        'callback' => 'generate_jwt_token',
        'permission_callback' => '__return_true'
    ));
});

function generate_jwt_token($request) {
    $params = $request->get_params();
    
    if (empty($params['username']) || empty($params['password'])) {
        return new WP_Error('missing_fields', 'Username and password are required', array('status' => 400));
    }

    $user = wp_authenticate($params['username'], $params['password']);

    if (is_wp_error($user)) {
        return $user;
    }

    // Generate JWT token
    $token = generate_jwt($user);

    return array(
        'token' => $token,
        'user' => array(
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email
        )
    );
}

function generate_jwt($user) {
    $secret_key = defined('JWT_AUTH_SECRET_KEY') ? JWT_AUTH_SECRET_KEY : false;
    
    if (!$secret_key) {
        return new WP_Error('jwt_auth_bad_config', 'JWT is not configured properly', array('status' => 500));
    }

    $issued_at = time();
    $not_before = $issued_at;
    $expire = $issued_at + (DAY_IN_SECONDS * 7);

    $token = array(
        'iss' => get_bloginfo('url'),
        'iat' => $issued_at,
        'nbf' => $not_before,
        'exp' => $expire,
        'data' => array(
            'user' => array(
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email
            )
        )
    );

    return jwt_encode($token, $secret_key);
}

function jwt_encode($token, $secret_key) {
    $header = array('typ' => 'JWT', 'alg' => 'HS256');
    $header = base64_encode(json_encode($header));
    $payload = base64_encode(json_encode($token));
    $signature = hash_hmac('sha256', "$header.$payload", $secret_key, true);
    $signature = base64_encode($signature);
    return "$header.$payload.$signature";
}


// Enable user registration via REST API
add_filter('rest_authentication_errors', function($result) {
    if (true === $result || is_wp_error($result)) {
        return $result;
    }

    // Allow authentication requests
    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp/v2/users') !== false) {
        return true;
    }

    return $result;
});

// Allow user registration
add_filter('option_users_can_register', '__return_true');

// Enable user creation via REST API
add_filter('rest_authentication_errors', function($result) {
    if (true === $result || is_wp_error($result)) {
        return $result;
    }

    // Allow admin to create users
    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp/v2/users') !== false) {
        return true;
    }

    return $result;
});

// Update CORS headers for React app
add_action('init', function() {
    $allowed_origins = array(
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
    }
});

// Handle preflight requests
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $allowed_origins = array(
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000'
        );
        
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With');
            header('Access-Control-Allow-Credentials: true');
        }
        return $value;
    });
}, 15);

// Register custom registration endpoint with improved validation
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'register_user_callback',
        'permission_callback' => '__return_true'
    ));
});

function register_user_callback($request) {
    $params = $request->get_params();
    $username = sanitize_user($params['username']);
    $email = sanitize_email($params['email']);
    $password = $params['password'];
    
    // Get additional fields
    $profession = isset($params['profession']) ? sanitize_text_field($params['profession']) : '';
    $phone = isset($params['phone']) ? sanitize_text_field($params['phone']) : '';
    $organization = isset($params['organization']) ? sanitize_text_field($params['organization']) : '';
    $country = isset($params['country']) ? sanitize_text_field($params['country']) : '';

    // Validate input
    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'All fields are required.', array('status' => 400));
    }

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Please enter a valid email address.', array('status' => 400));
    }

    if (strlen($password) < 6) {
        return new WP_Error('password_too_short', 'Password must be at least 6 characters long.', array('status' => 400));
    }

    // Check if the user already exists
    if (username_exists($username)) {
        return new WP_Error('registration_failed', 'Username already exists.', array('status' => 400));
    }

    if (email_exists($email)) {
        return new WP_Error('registration_failed', 'Email already exists.', array('status' => 400));
    }

    // Create the user
    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        return new WP_Error('registration_failed', $user_id->get_error_message(), array('status' => 400));
    }

    // Set the user role
    $user = new WP_User($user_id);
    $user->set_role('subscriber');

    // Save custom user meta fields
    update_user_meta($user_id, 'profession', $profession);
    update_user_meta($user_id, 'phone', $phone);
    update_user_meta($user_id, 'organization', $organization);
    update_user_meta($user_id, 'country', $country);

    // Generate JWT token for immediate login
    $token = generate_jwt($user);

    return new WP_REST_Response(array(
        'success' => true,
        'user_id' => $user_id,
        'token' => $token,
        'user' => array(
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'profession' => $profession,
            'phone' => $phone,
            'organization' => $organization,
            'country' => $country
        )
    ), 200);
}

// Register forgot password endpoint
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/lost-password', array(
        'methods' => 'POST',
        'callback' => 'handle_lost_password',
        'permission_callback' => '__return_true'
    ));
});

// Configure WordPress mail settings
add_action('phpmailer_init', 'configure_smtp');
function configure_smtp($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host = 'smtp.gmail.com'; // Replace with your SMTP host
    $phpmailer->SMTPAuth = true;
    $phpmailer->Port = 587;
    $phpmailer->Username = 'your-email@gmail.com'; // Replace with your email
    $phpmailer->Password = 'your-app-password'; // Replace with your app password
    $phpmailer->SMTPSecure = 'tls';
    $phpmailer->From = 'your-email@gmail.com';
    $phpmailer->FromName = 'JoySpan';
}

// Add error logging for mail
add_action('wp_mail_failed', 'log_mailer_errors', 10, 1);
function log_mailer_errors($wp_error) {
    error_log('Mail Error: ' . $wp_error->get_error_message());
}

function handle_lost_password($request) {
    $params = $request->get_params();
    $email = sanitize_email($params['email']);

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Please enter a valid email address.', array('status' => 400));
    }

    $user = get_user_by('email', $email);
    if (!$user) {
        // For security reasons, don't reveal if the email exists or not
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'If your email is registered, you will receive password reset instructions.'
        ), 200);
    }

    // Generate reset key
    $key = get_password_reset_key($user);
    if (is_wp_error($key)) {
        error_log('Reset Key Error: ' . $key->get_error_message());
        return new WP_Error('reset_key_error', 'Error generating reset key.', array('status' => 500));
    }

    // Create reset link
    $reset_link = network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user->user_login), 'login');

    // Email content
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0AA5C5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #0AA5C5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Password Reset Request</h1>
            </div>
            <div class='content'>
                <p>Hello " . esc_html($user->display_name) . ",</p>
                <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                <p>To reset your password, click the button below:</p>
                <p style='text-align: center;'>
                    <a href='" . esc_url($reset_link) . "' class='button'>Reset Password</a>
                </p>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style='word-break: break-all;'>" . esc_url($reset_link) . "</p>
                <p>This link will expire in 24 hours.</p>
                <p>Best regards,<br>The JoySpan Team</p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " JoySpan. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";

    // Email headers
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: JoySpan <noreply@joyspan.com>',
        'Reply-To: support@joyspan.com'
    );

    // For development/testing, log the email details
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Attempting to send password reset email to: ' . $user->user_email);
        error_log('Reset link: ' . $reset_link);
    }

    // Send email
    $mail_sent = wp_mail($user->user_email, 'Reset Your JoySpan Password', $message, $headers);

    if ($mail_sent) {
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'If your email is registered, you will receive password reset instructions.'
        ), 200);
    } else {
        error_log('Failed to send password reset email to: ' . $user->user_email);
        // For development, return success even if email fails
        if (defined('WP_DEBUG') && WP_DEBUG) {
            return new WP_REST_Response(array(
                'success' => true,
                'message' => 'If your email is registered, you will receive password reset instructions.',
                'debug_info' => array(
                    'reset_link' => $reset_link,
                    'email' => $user->user_email
                )
            ), 200);
        }
        return new WP_Error('email_error', 'Failed to send reset email.', array('status' => 500));
    }
}

// Register reset password endpoint
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/reset-password', array(
        'methods' => 'POST',
        'callback' => 'handle_reset_password',
        'permission_callback' => '__return_true'
    ));
});

function handle_reset_password($request) {
    $params = $request->get_params();
    $key = $params['key'];
    $login = $params['login'];
    $password = $params['password'];

    if (empty($key) || empty($login) || empty($password)) {
        return new WP_Error('missing_fields', 'All fields are required.', array('status' => 400));
    }

    $user = check_password_reset_key($key, $login);
    if (is_wp_error($user)) {
        return new WP_Error('invalid_key', 'This password reset link has expired or is invalid.', array('status' => 400));
    }

    // Reset the password
    reset_password($user, $password);

    return new WP_REST_Response(array(
        'success' => true,
        'message' => 'Your password has been reset successfully.'
    ), 200);
}

function register_wellness_post_types() {
    // Register Feelings post type
    register_post_type('feelings', array(
        'public' => true,
        'show_in_rest' => true,
        'supports' => array(
            'title',
            'editor',
            'thumbnail', // Featured image
            'excerpt',
            'custom-fields',
            'revisions',
            'author',
            'page-attributes',
            'post-formats',
            'comments',
            'trackbacks'
        ),
        'labels' => array(
            'name' => 'Feelings',
            'singular_name' => 'Feeling'
        ),
        'taxonomies' => array('category')
    ));

    // Register Activities post type
    register_post_type('activities', array(
        'public' => true,
        'show_in_rest' => true,
        'supports' => array(
            'title',
            'editor',
            'thumbnail', // Featured image
            'excerpt',
            'custom-fields',
            'revisions',
            'author',
            'page-attributes',
            'post-formats',
            'comments',
            'trackbacks'
        ),
        'labels' => array(
            'name' => 'Activities',
            'singular_name' => 'Activity'
        ),
        'taxonomies' => array('category')
    ));
}
add_action('init', 'register_wellness_post_types');

function register_user_meta_fields() {
    register_meta('user', 'profession', array(
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
    ));
    register_meta('user', 'phone', array(
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
    ));
    register_meta('user', 'organization', array(
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
    ));
    register_meta('user', 'country', array(
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'register_user_meta_fields');

// Add custom endpoint to get user details
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/user/me', array(
        'methods' => 'GET',
        'callback' => 'get_current_user_details',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ));
});

function get_current_user_details() {
    $current_user = wp_get_current_user();
    
    if (!$current_user->exists()) {
        return new WP_Error('not_logged_in', 'User is not logged in.', array('status' => 401));
    }

    // Get custom user meta fields
    $profession = get_user_meta($current_user->ID, 'profession', true);
    $phone = get_user_meta($current_user->ID, 'phone', true);
    $organization = get_user_meta($current_user->ID, 'organization', true);
    $country = get_user_meta($current_user->ID, 'country', true);

    return array(
        'id' => $current_user->ID,
        'name' => $current_user->display_name,
        'email' => $current_user->user_email,
        'username' => $current_user->user_login,
        'role' => $current_user->roles[0],
        'profession' => $profession,
        'phone' => $phone,
        'organization' => $organization,
        'country' => $country,
        'capabilities' => $current_user->allcaps,
        'first_name' => $current_user->first_name,
        'last_name' => $current_user->last_name,
        'description' => $current_user->description,
        'registered_date' => $current_user->user_registered
    );
}

// Register custom REST API endpoints
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/wellness-history', array(
        'methods' => 'GET, POST',
        'callback' => 'handle_wellness_history',
        'permission_callback' => function() {
            return current_user_can('read');
        }
    ));
});

function handle_wellness_history($request) {
    // Get the current user
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('not_logged_in', 'User must be logged in', array('status' => 401));
    }

    // Handle GET request
    if ($request->get_method() === 'GET') {
        // Get user's wellness history from user meta
        $wellness_history = get_user_meta($user_id, 'wellness_history', true);
        
        if (empty($wellness_history)) {
            return array(
                'success' => true,
                'data' => array(),
                'message' => 'No wellness history found'
            );
        }

        return array(
            'success' => true,
            'data' => $wellness_history,
            'message' => 'Wellness history retrieved successfully'
        );
    }
    
    // Handle POST request
    if ($request->get_method() === 'POST') {
        // Get all parameters from the request
        $params = $request->get_params();
        
        if (empty($params)) {
            return new WP_Error('missing_data', 'No data provided', array('status' => 400));
        }

        // Get existing history
        $existing_history = get_user_meta($user_id, 'wellness_history', true);
        if (!is_array($existing_history)) {
            $existing_history = array();
        }

        // Add new entry to history
        $new_entry = array(
            'feeling' => sanitize_text_field($params['feeling'] ?? ''),
            'feeling_value' => sanitize_text_field($params['feeling_value'] ?? ''),
            'activity' => sanitize_text_field($params['activity'] ?? ''),
            'section' => sanitize_text_field($params['section'] ?? ''),
            'completed_at' => sanitize_text_field($params['completed_at'] ?? ''),
            'activity_description' => wp_kses_post($params['activity_description'] ?? ''),
            'feeling_description' => wp_kses_post($params['feeling_description'] ?? ''),
            'activity_pdf_url' => isset($params['activity_pdf_url']) ? esc_url_raw($params['activity_pdf_url']) : '',
        );

        // Add to existing history
        $existing_history[] = $new_entry;

        // Save the updated history
        $result = update_user_meta($user_id, 'wellness_history', $existing_history);
        
        if ($result) {
            return array(
                'success' => true,
                'message' => 'Wellness history saved successfully',
                'data' => $new_entry
            );
        } else {
            return new WP_Error('save_failed', 'Failed to save wellness history', array('status' => 500));
        }
    }
}

// add_filter('acf/rest_api/activities/get_fields', function($data, $post, $request) {
//     if (isset($data['attached_pdf']) && is_numeric($data['attached_pdf'])) {
//         $data['attached_pdf'] = wp_get_attachment_url($data['attached_pdf']);
//     }
//     return $data;
// }, 10, 3);

// Add email field to REST API response
add_filter('rest_prepare_user', function($response, $user, $request) {
    $data = $response->get_data();
    $data['email'] = $user->user_email;
    $response->set_data($data);
    return $response;
}, 10, 3);