<?php
// Shared header/nav for every logged-in admin page. Include after
// requireLogin() and set $active to the current nav item's key.
$active = $active ?? '';
function navLink(string $key, string $href, string $label, string $active): string {
    $cls = $key === $active ? ' class="active"' : '';
    return "<a{$cls} href=\"{$href}\">{$label}</a>";
}
?>
<header class="bar">
  <strong><a href="index.php" style="color:inherit">Pressefy CMS</a></strong>
  <nav>
    <?= navLink('dashboard', 'index.php', 'Dashboard', $active) ?>
    <?= navLink('posts', 'posts.php', 'Posts', $active) ?>
    <?= navLink('trash', 'posts.php?status=trash', 'Trash', $active) ?>
    <?= navLink('contacts', 'contacts.php', 'Contacts', $active) ?>
    <?= navLink('subscribers', 'subscribers.php', 'Subscribers', $active) ?>
    <?= navLink('tokens', 'tokens.php', 'Application Passwords', $active) ?>
    <a href="logout.php">Log out</a>
  </nav>
</header>
