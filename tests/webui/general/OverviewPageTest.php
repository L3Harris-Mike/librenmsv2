<?php
namespace Tests\Webui\General;

use App\Models\Dashboard;
use App\Models\User;
use Tests\TestCase;

class OverviewPageTest extends TestCase
{

    /**
     * Test overview page
    **/

    public function testOverviewPage()
    {
        $this->seed();
        $user = factory(User::class)->create();

        $data = ['user_id' => $user['user_id'], 'dashboard_name' => 'Test Dashboard', 'access' => '0'];
        $dashboard = Dashboard::create($data);

        $this->actingAs($user)
             ->visit('/dashboard/'.$dashboard['dashboard_id'])
             ->see('Test Dashboard');
    }
}
